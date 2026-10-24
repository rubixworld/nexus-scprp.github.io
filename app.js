// ==========================================
// КОНФИГУРАЦИЯ
// ==========================================
const CONFIG = {
    SUPABASE_URL: '', 
    SUPABASE_KEY: '',
    ADMIN_LOGIN: 'admin',
    ADMIN_PASS: 'admin'
};

// ==========================================
// БАЗА ДАННЫХ (Заглушки)
// ==========================================
let DB = {
    news: JSON.parse(localStorage.getItem('nexus_news')) || [
        {
            id: 1,
            date: new Date().toLocaleDateString('ru-RU'),
            title: 'Запуск терминала Nexus',
            content: 'Добро пожаловать на официальный портал проекта Nexus • SCP-RP. Мы начинаем открытое тестирование. Следите за обновлениями.'
        }
    ],
    hosting: JSON.parse(localStorage.getItem('nexus_hosting')) || {
        serverStatus: 'ONLINE',   // ONLINE / OFFLINE / MAINTENANCE
        hostingStatus: 'NORMAL',  // NORMAL / PAYMENT / UNPAID / PROBLEMS / MAINTENANCE
        version: '1.20.1 FORGE'
    },
    staff: {
        management: [
            { role: 'Основатель', name: 'Founder_Name' },
            { role: 'Руководитель', name: 'Head_Name' },
            { role: 'Куратор', name: 'Curator_Name' }
        ],
        staff: [
            { role: 'Гл. Модератор', name: 'Mod_1' },
            { role: 'Модератор', name: 'Mod_2' },
            { role: 'Билдер', name: 'Builder_1' }
        ]
    }
};

function saveHosting() {
    localStorage.setItem('nexus_hosting', JSON.stringify(DB.hosting));
}

// ==========================================
// ЛОГИКА МОНИТОРА (зависит от 2 статусов)
// ==========================================
function getMonitorState() {
    const s = DB.hosting.serverStatus;
    const h = DB.hosting.hostingStatus;

    // Приоритет: критичные ошибки -> предупреждения -> норма
    if (h === 'UNPAID') {
        return { color: 'var(--scp-red)', label: 'HOSTING_UNPAID', code:
            '<span class="c-hash"># [CRITICAL]</span>\n<span class="c-key">server:</span> <span class="c-val">' + s + '</span>\n<span class="c-key">hosting:</span> <span class="c-val">UNPAID</span>\n<span class="c-key">action:</span> <span class="c-val">CONTACT_ADMIN</span>' };
    }
    if (h === 'PROBLEMS') {
        return { color: '#FF8C42', label: 'HOSTING_PROBLEMS', code:
            '<span class="c-hash"># [ERROR]</span>\n<span class="c-key">server:</span> <span class="c-val">' + s + '</span>\n<span class="c-key">hosting:</span> <span class="c-val">DEGRADED</span>\n<span class="c-key">status:</span> <span class="c-val">DIAGNOSTICS</span>' };
    }
    if (s === 'OFFLINE') {
        return { color: 'var(--scp-red)', label: 'SERVER_OFFLINE', code:
            '<span class="c-hash"># [OFFLINE]</span>\n<span class="c-key">server:</span> <span class="c-val">OFFLINE</span>\n<span class="c-key">hosting:</span> <span class="c-val">' + h + '</span>\n<span class="c-key">action:</span> <span class="c-val">WAIT_PLEASE</span>' };
    }
    if (h === 'PAYMENT') {
        return { color: 'var(--scp-yellow)', label: 'PAYMENT_PERIOD', code:
            '<span class="c-hash"># [WARNING]</span>\n<span class="c-key">server:</span> <span class="c-val">' + s + '</span>\n<span class="c-key">hosting:</span> <span class="c-val">PAYMENT_DUE</span>\n<span class="c-key">note:</span> <span class="c-val">RENEW_SOON</span>' };
    }
    if (s === 'MAINTENANCE' || h === 'MAINTENANCE') {
        return { color: 'var(--scp-yellow)', label: 'MAINTENANCE', code:
            '<span class="c-hash"># [MAINTENANCE]</span>\n<span class="c-key">server:</span> <span class="c-val">' + s + '</span>\n<span class="c-key">hosting:</span> <span class="c-val">' + h + '</span>\n<span class="c-key">eta:</span> <span class="c-val">~30_MIN</span>' };
    }
    return { color: 'var(--scp-green)', label: 'SYSTEM_NOMINAL', code:
        '<span class="c-hash"># [NOMINAL]</span>\n<span class="c-key">server:</span> <span class="c-val">ONLINE</span>\n<span class="c-key">hosting:</span> <span class="c-val">ACTIVE</span>\n<span class="c-key">uptime:</span> <span class="c-val">99.9%</span>' };
}

function renderMonitor() {
    const state = getMonitorState();
    return `
        <div class="server-monitor" style="--monitor-color: ${state.color};">
            <span class="monitor-corner mc-tl"></span>
            <span class="monitor-corner mc-tr"></span>
            <span class="monitor-corner mc-bl"></span>
            <span class="monitor-corner mc-br"></span>

            <div class="monitor-head">
                <span class="mono">NEXUS_NETWORK</span>
                <span class="mono live-indicator"><span class="live-dot"></span>LIVE</span>
            </div>

            <div class="monitor-body">
                <div class="pulse-wrap">
                    <div class="pulse-ring"></div>
                    <div class="pulse-dot"></div>
                </div>
                <div class="monitor-label mono">${state.label}</div>
                <div class="monitor-code mono">${state.code}</div>
            </div>

            <div class="monitor-stats">
                <div class="mstat">
                    <div class="mk mono">Server</div>
                    <div class="mv">${DB.hosting.serverStatus}</div>
                </div>
                <div class="mstat">
                    <div class="mk mono">Version</div>
                    <div class="mv">${DB.hosting.version}</div>
                </div>
                <div class="mstat">
                    <div class="mk mono">Access</div>
                    <div class="mv">PUBLIC</div>
                </div>
            </div>

            <div class="monitor-foot mono">
                <span>SECURE_CHANNEL</span>
                <span>///</span>
                <span>OK</span>
            </div>
        </div>
    `;
}

// ==========================================
// РОУТЕР
// ==========================================
const routes = {
    '/home': renderHome,
    '/rules-discord': renderRulesDiscord,
    '/rules-rp': renderRulesRP,
    '/rules-admin': renderRulesAdmin,
    '/management': renderManagement,
    '/staff': renderStaff,
    '/roles': renderRoles,
    '/download': renderDownload,
    '/about': renderAbout,
    '/admin': renderAdmin
};

function router() {
    let hash = window.location.hash.replace('#', '') || '/home';
    if (!routes[hash]) hash = '/home';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + hash);
    });

    const content = document.getElementById('app-content');
    content.innerHTML = '';
    routes[hash](content);
    
    if(window.innerWidth <= 900) document.getElementById('sidebar').classList.remove('open');
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// ==========================================
// СТРАНИЦЫ
// ==========================================
function renderHome(container) {
    const newsHTML = DB.news.map(n => `
        <div class="news-item">
            <div class="news-date">> DATE: ${n.date}</div>
            <div class="news-title">${n.title}</div>
            <div class="news-content">${n.content}</div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="grid-2 mb-20" style="gap: 30px; align-items: stretch;">
            <div class="panel" style="background: linear-gradient(180deg, rgba(88,153,249,0.1) 0%, transparent 100%); border-top: 2px solid var(--accent-start); display: flex; flex-direction: column; justify-content: center;">
                <h1 style="font-size: 2.5rem; margin-bottom: 10px;">NEXUS • SCP-RP</h1>
                <p class="mono" style="color: var(--accent-start); margin-bottom: 20px;">> ДОБРО ПОЖАЛОВАТЬ В ТЕРМИНАЛ ФОНДА</p>
                <p>Официальный портал ролевого проекта по вселенной SCP в Minecraft 1.20.1 Forge. Ознакомьтесь с документацией, правилами и списком персонала перед началом игры.</p>
                <div style="margin-top: 25px; display: flex; gap: 10px; flex-wrap: wrap;">
                    <a href="#/rules-rp" class="btn btn-outline">ПРАВИЛА RP</a>
                    <a href="#/download" class="btn btn-primary">СКАЧАТЬ ЛАУНЧЕР</a>
                </div>
            </div>
            <div style="display: flex; align-items: center; justify-content: center;">
                ${renderMonitor()}
            </div>
        </div>

        <h2>// ПОСЛЕДНИЕ ОБНОВЛЕНИЯ</h2>
        <div class="grid-2">
            <div class="panel">
                ${newsHTML || '<p class="muted">Новостей пока нет.</p>'}
            </div>
            <div class="panel">
                <h3 style="margin-bottom: 15px; color: var(--text-main);">БЫСТРЫЙ ДОСТУП</h3>
                <div class="grid-2" style="gap: 10px;">
                    <a href="#/management" class="btn btn-outline" style="flex-direction: column; padding: 20px; height: 100%;">
                        <span style="font-size: 1.5rem; margin-bottom: 10px;">👑</span>
                        РУКОВОДСТВО
                    </a>
                    <a href="#/rules-discord" class="btn btn-outline" style="flex-direction: column; padding: 20px; height: 100%;">
                        <span style="font-size: 1.5rem; margin-bottom: 10px;">💬</span>
                        DISCORD
                    </a>
                    <a href="#/staff" class="btn btn-outline" style="flex-direction: column; padding: 20px; height: 100%;">
                        <span style="font-size: 1.5rem; margin-bottom: 10px;">🛡️</span>
                        ПЕРСОНАЛ
                    </a>
                    <a href="#/roles" class="btn btn-outline" style="flex-direction: column; padding: 20px; height: 100%;">
                        <span style="font-size: 1.5rem; margin-bottom: 10px;">📋</span>
                        РОЛИ
                    </a>
                </div>
            </div>
        </div>
    `;
}

function renderRulesDiscord(container) {
    container.innerHTML = `
        <h1 class="mb-20">Правила Discord</h1>
        <div class="panel">
            <h2>1. Общие положения</h2>
            <p>1.1. Заходя на сервер, вы автоматически соглашаетесь с данными правилами.</p>
            <p>1.2. Незнание правил не освобождает от ответственности.</p>
            <p>1.3. Администрация оставляет за собой право изменять правила без предупреждения.</p>
            
            <h2 class="mt-15">2. Нормы общения</h2>
            <p>2.1. Запрещено оскорбление участников, администрации и их родных.</p>
            <p>2.2. Запрещены спам, флуд, капс и злоупотребление эмодзи.</p>
            <p>2.3. Запрещены NSFW, шок-контент и любые упоминания политики/религии.</p>
            
            <h2 class="mt-15">3. Голосовые каналы</h2>
            <p>3.1. Запрещено использование Soundpad без разрешения участников канала.</p>
            <p>3.2. Запрещены громкие звуки и крики в микрофон.</p>
        </div>
    `;
}

function renderRulesRP(container) {
    container.innerHTML = `
        <h1 class="mb-20">Правила отыгровки (RP)</h1>
        <div class="panel">
            <h2>1. Основы Roleplay</h2>
            <p>1.1. <b>FearRP</b> — ваш персонаж должен бояться за свою жизнь при угрозе оружием.</p>
            <p>1.2. <b>FailRP</b> — запрещено совершать действия, невозможные в реальной жизни.</p>
            <p>1.3. <b>PowerGaming</b> — запрещено навязывать действия другим игрокам без отыгровки.</p>
            
            <h2 class="mt-15">2. Персонаж</h2>
            <p>2.1. Запрещено использовать ники и скины, нарушающие атмосферу SCP.</p>
            <p>2.2. Ваш персонаж должен иметь логичную историю и поведение.</p>
        </div>
    `;
}

function renderRulesAdmin(container) {
    container.innerHTML = `
        <h1 class="mb-20">Правила администрации</h1>
        <div class="panel" style="text-align: center; padding: 50px;">
            <h2 style="border: none; color: var(--scp-yellow);">⚠ РАЗДЕЛ В РАЗРАБОТКЕ ⚠</h2>
            <p class="mono">Документ находится на стадии утверждения высшим руководством.</p>
            <p>Ожидайте обновления в ближайшее время.</p>
        </div>
    `;
}

function renderManagement(container) {
    const mgmt = DB.staff.management.map(s => `
        <div class="staff-card">
            <div class="staff-role">${s.role}</div>
            <div class="staff-name">${s.name}</div>
        </div>
    `).join('');

    container.innerHTML = `
        <h1 class="mb-20">Высшее руководство</h1>
        <div class="grid-3 mb-20">${mgmt}</div>
    `;
}

function renderStaff(container) {
    const staff = DB.staff.staff.map(s => `
        <div class="staff-card">
            <div class="staff-role">${s.role}</div>
            <div class="staff-name">${s.name}</div>
        </div>
    `).join('');

    container.innerHTML = `
        <h1 class="mb-20">Персонал проекта</h1>
        <div class="grid-4 mb-20">${staff}</div>
        <p class="mono muted text-center">* Список обновляется вручную руководством.</p>
    `;
}

function renderRoles(container) {
    container.innerHTML = `
        <h1 class="mb-20">Роли проекта</h1>
        <div class="panel">
            <h2>// Список ролей (Заглушка)</h2>
            <p>Описание игровых ролей, классов и уровней допуска появится позже.</p>
            <ul style="list-style: none; color: var(--text-muted); margin-top: 20px;">
                <li style="padding: 10px; border-bottom: 1px solid var(--border);">> Класс-D (Расходный материал)</li>
                <li style="padding: 10px; border-bottom: 1px solid var(--border);">> Научный сотрудник</li>
                <li style="padding: 10px; border-bottom: 1px solid var(--border);">> Служба безопасности</li>
                <li style="padding: 10px; border-bottom: 1px solid var(--border);">> МОГ (Мобильная Оперативная Группа)</li>
            </ul>
        </div>
    `;
}

function renderDownload(container) {
    container.innerHTML = `
        <h1 class="mb-20">Скачать лаунчер</h1>
        <div class="panel">
            <div class="grid-2">
                <div>
                    <h2>Версия 1.0.0</h2>
                    <p>Дата обновления: 24.10.2026</p>
                    <p>Сборка: Minecraft 1.20.1 Forge, моды на SCP, оптимизация, русификатор.</p>
                    <br>
                    <a href="#" class="btn btn-primary" onclick="alert('Ссылка на скачивание появится позже')">СКАЧАТЬ (Windows)</a>
                </div>
                <div style="border-left: 1px solid var(--border); padding-left: 20px;">
                    <h3>Что добавлено:</h3>
                    <ul class="mono muted" style="margin-top: 10px; line-height: 1.8;">
                        <li>- Оптимизация (FPS+)</li>
                        <li>- Мод SCP: Lockdown</li>
                        <li>- Кастомные модели оружия</li>
                        <li>- Настройки интерфейса</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function renderAbout(container) {
    container.innerHTML = `
        <h1 class="mb-20">О нас / Связь</h1>
        <div class="panel mb-20">
            <h2>// О проекте</h2>
            <p>Nexus • SCP-RP — это проект, созданный энтузиастами для глубокой и атмосферной ролевой игры по вселенной SCP в Minecraft. Мы ценим качественный отыгрыш, дисциплину и дружелюбное комьюнити.</p>
        </div>
        <div class="grid-3">
            <a href="#" class="panel" style="text-align: center; display: block;">
                <div style="font-size: 2rem; margin-bottom: 10px;">💬</div>
                <h3 style="color: var(--text-main);">Discord</h3>
                <p class="mono muted">Основной хаб</p>
            </a>
            <a href="#" class="panel" style="text-align: center; display: block;">
                <div style="font-size: 2rem; margin-bottom: 10px;">✈️</div>
                <h3 style="color: var(--text-main);">Telegram</h3>
                <p class="mono muted">Новости</p>
            </a>
            <a href="#" class="panel" style="text-align: center; display: block;">
                <div style="font-size: 2rem; margin-bottom: 10px;">▶️</div>
                <h3 style="color: var(--text-main);">YouTube</h3>
                <p class="mono muted">Медиа</p>
            </a>
        </div>
    `;
}

// ==========================================
// АДМИНКА
// ==========================================
function isAdmin() {
    return sessionStorage.getItem('nexus_admin') === 'true';
}

function renderAdmin(container) {
    if (!isAdmin()) {
        window.location.hash = '#/home';
        openModal('loginModal');
        return;
    }

    const newsList = DB.news.map(n => `
        <div class="panel" style="padding: 15px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong style="color: #fff;">${n.title}</strong><br>
                <span class="mono muted" style="font-size: 0.8rem;">${n.date}</span>
            </div>
            <button class="btn btn-danger" onclick="deleteNews(${n.id})">Удалить</button>
        </div>
    `).join('');

    const s = DB.hosting.serverStatus;
    const h = DB.hosting.hostingStatus;

    container.innerHTML = `
        <div class="panel mb-20" style="border-left: 3px solid var(--scp-red);">
            <h1 style="color: var(--scp-red);">ADMIN CONTROL PANEL</h1>
            <p class="mono">> STATUS: ACCESS GRANTED</p>
            <button class="btn btn-outline mt-15" onclick="logout()">ЗАВЕРШИТЬ СЕАНС</button>
        </div>

        <!-- МОНИТОР -->
        <div class="panel mb-20">
            <h2>// Монитор сервера</h2>
            <p class="muted mono mb-15">> Статус СЕРВЕРА:</p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;">
                <button class="btn btn-outline ${s==='ONLINE'?'active-status':''}" onclick="setServerStatus('ONLINE')">ONLINE</button>
                <button class="btn btn-outline ${s==='OFFLINE'?'active-status':''}" onclick="setServerStatus('OFFLINE')">OFFLINE</button>
                <button class="btn btn-outline ${s==='MAINTENANCE'?'active-status':''}" onclick="setServerStatus('MAINTENANCE')">MAINTENANCE</button>
            </div>
            <p class="muted mono mb-15">> Статус ХОСТИНГА:</p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn btn-outline ${h==='NORMAL'?'active-status':''}" onclick="setHostingStatus('NORMAL')">NORMAL</button>
                <button class="btn btn-outline ${h==='PAYMENT'?'active-status':''}" onclick="setHostingStatus('PAYMENT')">PAYMENT</button>
                <button class="btn btn-outline ${h==='UNPAID'?'active-status':''}" onclick="setHostingStatus('UNPAID')">UNPAID</button>
                <button class="btn btn-outline ${h==='PROBLEMS'?'active-status':''}" onclick="setHostingStatus('PROBLEMS')">PROBLEMS</button>
                <button class="btn btn-outline ${h==='MAINTENANCE'?'active-status':''}" onclick="setHostingStatus('MAINTENANCE')">MAINTENANCE</button>
            </div>
        </div>

        <div class="grid-2">
            <div class="panel">
                <h2>// Создать новость</h2>
                <input type="text" id="newsTitle" class="input-field" placeholder="Заголовок">
                <textarea id="newsContent" class="input-field" placeholder="Текст новости..."></textarea>
                <button class="btn btn-primary" onclick="createNews()">ОПУБЛИКОВАТЬ</button>
            </div>
            <div>
                <h2>// Управление новостями</h2>
                ${newsList}
            </div>
        </div>
    `;
}

function setServerStatus(status) {
    DB.hosting.serverStatus = status;
    saveHosting();
    renderAdmin(document.getElementById('app-content'));
}
function setHostingStatus(status) {
    DB.hosting.hostingStatus = status;
    saveHosting();
    renderAdmin(document.getElementById('app-content'));
}

// ==========================================
// АВТОРИЗАЦИЯ
// ==========================================
function doLogin() {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;
    const err = document.getElementById('loginError');

    if (user === CONFIG.ADMIN_LOGIN && pass === CONFIG.ADMIN_PASS) {
        sessionStorage.setItem('nexus_admin', 'true');
        document.getElementById('adminNavLink').style.display = 'block';
        closeModal('loginModal');
        err.textContent = '';
        window.location.hash = '#/admin';
        router();
    } else {
        err.textContent = '> ОШИБКА: НЕВЕРНЫЙ ЛОГИН ИЛИ ПАРОЛЬ';
    }
}

function logout() {
    sessionStorage.removeItem('nexus_admin');
    document.getElementById('adminNavLink').style.display = 'none';
    window.location.hash = '#/home';
    router();
}

// ==========================================
// НОВОСТИ
// ==========================================
function createNews() {
    const title = document.getElementById('newsTitle').value;
    const content = document.getElementById('newsContent').value;
    if (!title || !content) return alert('Заполните все поля!');

    DB.news.unshift({
        id: Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        title: title,
        content: content
    });
    
    localStorage.setItem('nexus_news', JSON.stringify(DB.news));
    renderAdmin(document.getElementById('app-content'));
    alert('Новость опубликована!');
}

function deleteNews(id) {
    if (!confirm('Удалить эту новость?')) return;
    DB.news = DB.news.filter(n => n.id !== id);
    localStorage.setItem('nexus_news', JSON.stringify(DB.news));
    renderAdmin(document.getElementById('app-content'));
}

// ==========================================
// МОДАЛКИ И СЕКРЕТНЫЙ ВХОД
// ==========================================
document.querySelector('.brand').addEventListener('click', function(e) {
    if (e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        if (isAdmin()) window.location.hash = '#/admin';
        else openModal('loginModal');
    }
});

if (isAdmin()) {
    document.getElementById('adminNavLink').style.display = 'block';
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
