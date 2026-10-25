// ==========================================
// КОНФИГУРАЦИЯ
// ==========================================
const CONFIG = {
    SUPABASE_URL: '', 
    SUPABASE_KEY: '',
    ADMIN_LOGIN: 'nexus-scprp',
    ADMIN_PASS: 'nexus-password-scprp'
};

// ==========================================
// БАЗА ДАННЫХ (Заглушка под Supabase)
// ==========================================
let DB = {
    news: JSON.parse(localStorage.getItem('nexus_news')) || [
        {
            id: 1,
            date: new Date().toLocaleDateString('ru-RU'),
            title: 'Запуск терминала Nexus',
            content: 'Добро пожаловать на официальный портал проекта Nexus • SCP-RP. Мы начинаем открытое тестирование. Следите за обновлениями.',
            image: ''
        }
    ],
    settings: JSON.parse(localStorage.getItem('nexus_settings')) || {
        ip: 'play.nexus-scp.ru',
        version: '1.20.1 FORGE',
        maintenance: false,
        maintMsg: 'Сервер находится на обновлении. Пожалуйста, зайдите позже.',
        serverStatus: 'ONLINE',
        hostingStatus: 'NORMAL'
    },
    staff: [
        { num: 14, section: 'high', role: 'Основатель проекта', name: 'Sayderty', tag: 'FOUNDER', level: 'LEVEL-5' },
        { num: 13, section: 'high', role: 'Руководитель проекта', name: 'dark_esz', tag: 'MANAGER', level: 'LEVEL-5' },
        { num: 12, section: 'high', role: 'Куратор', name: 'NewStalker3041', tag: 'CURATOR', level: 'LEVEL-4' },
        { num: 11, section: 'admin', role: 'Главный администратор', name: null },
        { num: 10, section: 'admin', role: 'Старший администратор', name: null },
        { num: 9, section: 'admin', role: 'Администратор', name: null },
        { num: 8, section: 'admin', role: 'Младший администратор', name: 'GeoMatrixi' },
        { num: 7, section: 'mod', role: 'Главный модератор', name: null },
        { num: 6, section: 'mod', role: 'Старший модератор', name: null },
        { num: 5, section: 'mod', role: 'Модератор', name: null },
        { num: 4, section: 'mod', role: 'Младший модератор', name: 'Iskatel_Misteki3' },
        { num: 3, section: 'trainee', role: 'Стажёр', name: null },
        { num: 2, section: 'builder', role: 'Главный билдер', name: null },
        { num: 1, section: 'builder', role: 'Билдер', name: null }
    ]
};

function saveData() {
    localStorage.setItem('nexus_news', JSON.stringify(DB.news));
    localStorage.setItem('nexus_settings', JSON.stringify(DB.settings));
}

function applySettings() {
    document.getElementById('mon-ip').textContent = DB.settings.ip;
    document.getElementById('mon-ver').textContent = DB.settings.version;
    document.getElementById('mntMessage').textContent = DB.settings.maintMsg;
    
    // Тех. работы
    const mnt = document.getElementById('maintenance');
    const isAdmin = sessionStorage.getItem('nexus_admin') === 'true';
    if (DB.settings.maintenance && !isAdmin) {
        mnt.classList.add('show');
    } else {
        mnt.classList.remove('show');
    }
}

// ==========================================
// МОНИТОР
// ==========================================
function getMonitorState() {
    const s = DB.settings.serverStatus;
    const h = DB.settings.hostingStatus;

    if (h === 'UNPAID') return { color: 'var(--scp-red)', label: 'HOSTING_UNPAID', code: '<span class="c-hash"># [CRITICAL]</span>\n<span class="c-key">server:</span> <span class="c-val">' + s + '</span>\n<span class="c-key">hosting:</span> <span class="c-val">UNPAID</span>' };
    if (h === 'PROBLEMS') return { color: '#FF8C42', label: 'HOSTING_PROBLEMS', code: '<span class="c-hash"># [ERROR]</span>\n<span class="c-key">server:</span> <span class="c-val">' + s + '</span>\n<span class="c-key">hosting:</span> <span class="c-val">DEGRADED</span>' };
    if (s === 'OFFLINE') return { color: 'var(--scp-red)', label: 'SERVER_OFFLINE', code: '<span class="c-hash"># [OFFLINE]</span>\n<span class="c-key">server:</span> <span class="c-val">OFFLINE</span>' };
    if (h === 'PAYMENT') return { color: 'var(--scp-yellow)', label: 'PAYMENT_PERIOD', code: '<span class="c-hash"># [WARNING]</span>\n<span class="c-key">server:</span> <span class="c-val">' + s + '</span>\n<span class="c-key">hosting:</span> <span class="c-val">PAYMENT_DUE</span>' };
    if (s === 'MAINTENANCE' || h === 'MAINTENANCE') return { color: 'var(--scp-yellow)', label: 'MAINTENANCE', code: '<span class="c-hash"># [MAINTENANCE]</span>\n<span class="c-key">server:</span> <span class="c-val">' + s + '</span>' };
    
    return { color: 'var(--scp-green)', label: 'SYSTEM_NOMINAL', code: '<span class="c-hash"># [NOMINAL]</span>\n<span class="c-key">server:</span> <span class="c-val">ONLINE</span>\n<span class="c-key">uptime:</span> <span class="c-val">99.9%</span>' };
}

function renderMonitor() {
    const state = getMonitorState();
    return `
        <div class="server-monitor" style="--monitor-color: ${state.color};">
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
                <div class="mstat"><div class="mk mono">Server</div><div class="mv" id="mon-ip" style="font-size:0.6rem; word-break:break-all;">${DB.settings.ip}</div></div>
                <div class="mstat"><div class="mk mono">Version</div><div class="mv" id="mon-ver" style="font-size:0.65rem;">${DB.settings.version}</div></div>
                <div class="mstat"><div class="mk mono">Access</div><div class="mv">PUBLIC</div></div>
            </div>
        </div>
    `;
}

// ==========================================
// РОУТЕР
// ==========================================
const routes = {
    '/home': renderHome, '/rules-discord': renderRulesDiscord, '/rules-rp': renderRulesRP,
    '/rules-admin': renderRulesAdmin, '/management': renderManagement, '/staff': renderStaff,
    '/roles': renderRoles, '/download': renderDownload, '/about': renderAbout, '/admin': renderAdmin
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
    if (window.innerWidth <= 900) document.getElementById('sidebar').classList.remove('open');
    
    applySettings();
    initMouseGlow(); 
}

window.addEventListener('hashchange', router);
window.addEventListener('load', () => { router(); initMouseGlow(); });
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

// ==========================================
// СТРАНИЦЫ
// ==========================================
function renderHome(container) {
    const newsHTML = DB.news.map(n => `
        <div class="news-item">
            <div class="news-date">> DATE: ${n.date}</div>
            <div class="news-title">${n.title}</div>
            <div class="news-content">${n.content}</div>
            ${n.image ? `<img src="${n.image}" style="width:100%; border-radius:8px; margin-top:10px;">` : ''}
        </div>
    `).join('');

    container.innerHTML = `
        <div class="grid-2 mb-20" style="gap: 30px; align-items: stretch;">
            <div class="panel" style="background: linear-gradient(180deg, rgba(88,153,249,0.1) 0%, transparent 100%); display: flex; flex-direction: column; justify-content: center;">
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
        <div class="panel">${newsHTML || '<p class="muted">Новостей пока нет.</p>'}</div>
    `;
}

// ... (Остальные страницы: rules-discord, rules-rp, rules-admin, management, staff, roles, download, about - оставляем без изменений, они уже есть у тебя)

// ==========================================
// АДМИНКА
// ==========================================
function isAdmin() { return sessionStorage.getItem('nexus_admin') === 'true'; }

function renderAdmin(container) {
    if (!isAdmin()) {
        window.location.hash = '#/home';
        openModal('loginModal');
        return;
    }

    container.innerHTML = `
        <div class="panel mb-20" style="border-left: 3px solid var(--scp-red);">
            <h1 style="color: var(--scp-red);">ADMIN CONTROL PANEL</h1>
            <p class="mono">> STATUS: ACCESS GRANTED</p>
            <button class="btn btn-outline mt-15" onclick="logout()">ЗАВЕРШИТЬ СЕАНС</button>
        </div>

        <div class="admin-tabs">
            <button class="admin-tab active" onclick="switchTab('tab-news', this)">Новости</button>
            <button class="admin-tab" onclick="switchTab('tab-settings', this)">Настройки</button>
            <button class="admin-tab" onclick="switchTab('tab-system', this)">Система</button>
        </div>

        <!-- ВКЛАДКА: НОВОСТИ -->
        <div class="admin-section active" id="tab-news">
            <div class="grid-2">
                <div class="panel">
                    <h2>// Создать новость</h2>
                    <input type="text" id="newsTitle" class="input-field" placeholder="Заголовок">
                    <textarea id="newsContent" class="input-field" placeholder="Текст новости..."></textarea>
                    <input type="url" id="newsImage" class="input-field" placeholder="Ссылка на картинку (URL, необязательно)">
                    <button class="btn btn-primary" onclick="createNews()">ОПУБЛИКОВАТЬ</button>
                </div>
                <div class="panel">
                    <h2>// Опубликовано</h2>
                    <div id="adminNewsList">
                        ${DB.news.map(n => `
                            <div class="news-admin-item">
                                <div><strong style="color:#fff">${n.title}</strong><br><span class="mono muted" style="font-size:0.7rem">${n.date}</span></div>
                                <button class="btn btn-danger" onclick="deleteNews(${n.id})">✕</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>

        <!-- ВКЛАДКА: НАСТРОЙКИ -->
        <div class="admin-section" id="tab-settings">
            <div class="panel">
                <h2>// Сервер и Монитор</h2>
                <div class="grid-2">
                    <div>
                        <label class="mono muted">IP Сервера</label>
                        <input type="text" id="setIp" class="input-field" value="${DB.settings.ip}">
                    </div>
                    <div>
                        <label class="mono muted">Версия (например, 1.20.1 FORGE)</label>
                        <input type="text" id="setVer" class="input-field" value="${DB.settings.version}">
                    </div>
                </div>
                
                <div class="grid-2 mt-15">
                    <div>
                        <label class="mono muted">Статус СЕРВЕРА</label>
                        <select id="setServerStatus" class="input-field">
                            <option value="ONLINE" ${DB.settings.serverStatus==='ONLINE'?'selected':''}>ONLINE</option>
                            <option value="OFFLINE" ${DB.settings.serverStatus==='OFFLINE'?'selected':''}>OFFLINE</option>
                            <option value="MAINTENANCE" ${DB.settings.serverStatus==='MAINTENANCE'?'selected':''}>MAINTENANCE</option>
                        </select>
                    </div>
                    <div>
                        <label class="mono muted">Статус ХОСТИНГА</label>
                        <select id="setHostingStatus" class="input-field">
                            <option value="NORMAL" ${DB.settings.hostingStatus==='NORMAL'?'selected':''}>NORMAL</option>
                            <option value="PAYMENT" ${DB.settings.hostingStatus==='PAYMENT'?'selected':''}>PAYMENT</option>
                            <option value="UNPAID" ${DB.settings.hostingStatus==='UNPAID'?'selected':''}>UNPAID</option>
                            <option value="PROBLEMS" ${DB.settings.hostingStatus==='PROBLEMS'?'selected':''}>PROBLEMS</option>
                        </select>
                    </div>
                </div>
                <button class="btn btn-primary mt-15" onclick="saveSettings()">СОХРАНИТЬ НАСТРОЙКИ</button>
            </div>
        </div>

        <!-- ВКЛАДКА: СИСТЕМА -->
        <div class="admin-section" id="tab-system">
            <div class="panel">
                <h2>// Режим технических работ</h2>
                <p class="muted">Закрывает сайт заглушкой для всех, кроме администраторов.</p>
                <label class="mono mt-15" style="display:block; margin-bottom:10px;">
                    <input type="checkbox" id="setMaint" ${DB.settings.maintenance?'checked':''} style="width:20px; height:20px; vertical-align:middle; margin-right:10px;"> 
                    ВКЛЮЧИТЬ ТЕХ. РАБОТЫ
                </label>
                <input type="text" id="setMaintMsg" class="input-field" value="${DB.settings.maintMsg}" placeholder="Сообщение на экране">
                <button class="btn btn-primary mt-15" onclick="saveSettings()">ПРИМЕНИТЬ</button>
            </div>

            <div class="panel">
                <h2>// Бэкап данных</h2>
                <p class="muted">Скачай JSON файл со всеми новостями и настройками.</p>
                <button class="btn btn-outline mt-15" onclick="exportData()">📥 ЭКСПОРТ</button>
                <button class="btn btn-outline mt-15" onclick="document.getElementById('importFile').click()">📤 ИМПОРТ</button>
                <input type="file" id="importFile" style="display:none" accept=".json" onchange="importData(event)">
            </div>
        </div>
    `;
}

// Вспомогательные функции админки
function switchTab(tabId, btn) {
    document.querySelectorAll('.admin-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.admin-tab').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

function saveSettings() {
    DB.settings.ip = document.getElementById('setIp').value;
    DB.settings.version = document.getElementById('setVer').value;
    DB.settings.serverStatus = document.getElementById('setServerStatus').value;
    DB.settings.hostingStatus = document.getElementById('setHostingStatus').value;
    DB.settings.maintenance = document.getElementById('setMaint').checked;
    DB.settings.maintMsg = document.getElementById('setMaintMsg').value;
    saveData();
    applySettings();
    alert('Настройки сохранены!');
}

function createNews() {
    const title = document.getElementById('newsTitle').value;
    const content = document.getElementById('newsContent').value;
    const image = document.getElementById('newsImage').value;
    if (!title || !content) return alert('Заполните текст и заголовок!');

    DB.news.unshift({ id: Date.now(), date: new Date().toLocaleDateString('ru-RU'), title, content, image });
    saveData();
    renderAdmin(document.getElementById('app-content'));
    switchTab('tab-news', document.querySelector('.admin-tab'));
}

function deleteNews(id) {
    if (!confirm('Удалить новость?')) return;
    DB.news = DB.news.filter(n => n.id !== id);
    saveData();
    renderAdmin(document.getElementById('app-content'));
    switchTab('tab-news', document.querySelector('.admin-tab'));
}

// Экспорт / Импорт
function exportData() {
    const data = { news: DB.news, settings: DB.settings };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'nexus-backup.json'; a.click();
}
function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const data = JSON.parse(ev.target.result);
            if (data.news) DB.news = data.news;
            if (data.settings) DB.settings = data.settings;
            saveData(); alert('Данные загружены!'); location.reload();
        } catch(err) { alert('Ошибка файла'); }
    };
    reader.readAsText(file);
}

// ==========================================
// АВТОРИЗАЦИЯ
// ==========================================
function doLogin() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    const err = document.getElementById('loginError');

    if (user === CONFIG.ADMIN_LOGIN && pass === CONFIG.ADMIN_PASS) {
        sessionStorage.setItem('nexus_admin', 'true');
        document.getElementById('adminNavLink').style.display = 'flex';
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

document.querySelector('.brand').addEventListener('click', function(e) {
    if (e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        if (isAdmin()) window.location.hash = '#/admin';
        else openModal('loginModal');
    }
});

if (isAdmin()) document.getElementById('adminNavLink').style.display = 'flex';
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// ==========================================
// ЭФФЕКТ ФОНАРИКА (Mouse Glow)
// ==========================================
function initMouseGlow() {
    const glowElements = document.querySelectorAll('.panel, .mgmt-card, .news-item, .staff-row');
    glowElements.forEach(el => {
        el.classList.add('mouse-glow');
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });
}
