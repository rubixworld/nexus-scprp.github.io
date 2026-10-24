// ==========================================
// КОНФИГУРАЦИЯ (Под будущий Supabase)
// ==========================================
const CONFIG = {
    // Сюда потом вставим ключи Supabase
    SUPABASE_URL: '', 
    SUPABASE_KEY: '',
    // Временный пароль для админки (потом заменим на Supabase Auth)
    ADMIN_LOGIN: 'admin',
    ADMIN_PASS: 'admin'
};

// ==========================================
// БАЗА ДАННЫХ (Заглушки, позже переедет в Supabase)
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

// ==========================================
// РОУТЕР (Навигация)
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
    
    // Обновляем активный класс в меню
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + hash);
    });

    // Рендерим страницу
    const content = document.getElementById('app-content');
    content.innerHTML = '';
    routes[hash](content);
    
    // Закрываем сайдбар на мобилке после перехода
    if(window.innerWidth <= 900) document.getElementById('sidebar').classList.remove('open');
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// ==========================================
// РЕНДЕР СТРАНИЦ
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
        <div class="panel mb-20" style="background: linear-gradient(180deg, rgba(88,153,249,0.1) 0%, transparent 100%); border-top: 2px solid var(--accent-start);">
            <h1 style="font-size: 2.5rem; margin-bottom: 10px;">NEXUS • SCP-RP</h1>
            <p class="mono" style="color: var(--accent-start); margin-bottom: 20px;">> ДОБРО ПОЖАЛОВАТЬ В ТЕРМИНАЛ ФОНДА</p>
            <p>Официальный портал ролевого проекта по вселенной SCP в Minecraft 1.20.1 Forge. Ознакомьтесь с документацией, правилами и списком персонала перед началом игры.</p>
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <a href="#/rules-rp" class="btn btn-outline">ПРАВИЛА RP</a>
                <a href="#/download" class="btn btn-primary">ИГРАТЬ</a>
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
            <p>1.2. <b>FailRP</b> — запрещено совершать действия, невозможные в реальной жизни (например, прыгать с 10 этажа без урона).</p>
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
        <div class="grid-3 mb-20">
            ${mgmt}
        </div>
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
        <div class="grid-4 mb-20">
            ${staff}
        </div>
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
                    <p>В сборку входит: Minecraft 1.20.1 Forge, моды на SCP (модели, механики), оптимизация, русификатор.</p>
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
// АДМИНКА (Вход и Панель)
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

    container.innerHTML = `
        <div class="panel mb-20" style="border-left: 3px solid var(--scp-red);">
            <h1 style="color: var(--scp-red);">ADMIN CONTROL PANEL</h1>
            <p class="mono">> STATUS: ACCESS GRANTED</p>
            <button class="btn btn-outline mt-15" onclick="logout()">ЗАВЕРШИТЬ СЕАНС</button>
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

// Логика входа
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

// Логика новостей
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
    alert('Новость опубликована! (Сохранено в localStorage)');
}

function deleteNews(id) {
    if (!confirm('Удалить эту новость?')) return;
    DB.news = DB.news.filter(n => n.id !== id);
    localStorage.setItem('nexus_news', JSON.stringify(DB.news));
    renderAdmin(document.getElementById('app-content'));
}

// ==========================================
// СЕКРЕТНЫЙ ВХОД В АДМИНКУ
// ==========================================
// Зажимаем Ctrl + Shift и кликаем на логотип "NEXUS" в сайдбаре
document.querySelector('.brand').addEventListener('click', function(e) {
    if (e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        if (isAdmin()) {
            window.location.hash = '#/admin';
        } else {
            openModal('loginModal');
        }
    }
});

// При загрузке проверяем, не залогинен ли уже админ
if (isAdmin()) {
    document.getElementById('adminNavLink').style.display = 'block';
}

// Модалки
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
