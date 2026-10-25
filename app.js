// ==========================================
// КОНФИГУРАЦИЯ
// ==========================================
const CONFIG = {
    SUPABASE_URL: '', 
    SUPABASE_KEY: '',
    ADMIN_LOGIN: 'nexus-scprp',
    ADMIN_PASS: 'nexus-password-scprp'
};

// Безопасный парсинг, чтобы битые данные не ломали сайт
function safeParse(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.warn("Ошибка парсинга данных:", key);
        return fallback;
    }
}

// ==========================================
// БАЗА ДАННЫХ
// ==========================================
let DB = {
    news: safeParse('nexus_news', [
        {
            id: 1,
            date: new Date().toLocaleDateString('ru-RU'),
            title: 'Запуск терминала Nexus',
            content: 'Добро пожаловать на официальный портал проекта Nexus • SCP-RP. Мы начинаем открытое тестирование. Следите за обновлениями.',
            image: ''
        }
    ]),
    settings: safeParse('nexus_settings', {
        ip: 'play.nexus-scp.ru',
        version: '1.20.1 FORGE',
        maintenance: false,
        maintMsg: 'Сервер находится на обновлении. Пожалуйста, зайдите позже.',
        serverStatus: 'ONLINE',
        hostingStatus: 'NORMAL'
    })
};

// На случай, если объект есть, но в нем нет полей
if (!DB.settings) DB.settings = {};
if (!DB.settings.ip) DB.settings.ip = 'play.nexus-scp.ru';
if (!DB.settings.version) DB.settings.version = '1.20.1 FORGE';
if (!DB.news) DB.news = [];

function saveData() {
    localStorage.setItem('nexus_news', JSON.stringify(DB.news));
    localStorage.setItem('nexus_settings', JSON.stringify(DB.settings));
}

function applySettings() {
    try {
        const monIp = document.getElementById('mon-ip');
        if (monIp) monIp.textContent = DB.settings.ip;
        
        const monVer = document.getElementById('mon-ver');
        if (monVer) monVer.textContent = DB.settings.version;
        
        const mntMsg = document.getElementById('mntMessage');
        if (mntMsg) mntMsg.textContent = DB.settings.maintMsg;
        
        const mnt = document.getElementById('maintenance');
        const isAdmin = sessionStorage.getItem('nexus_admin') === 'true';
        if (mnt) {
            if (DB.settings.maintenance && !isAdmin) mnt.classList.add('show');
            else mnt.classList.remove('show');
        }
    } catch(e) { console.error('Ошибка в applySettings', e); }
}

// ==========================================
// ПЕРСОНАЛ И ПРАВИЛА
// ==========================================
const STAFF_LIST = [
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
];

const STAFF_SECTIONS = {
    high:    { title: 'Высшее руководство', icon: '👑', class: 'high' },
    admin:   { title: 'Администрация', icon: '⚙️', class: '' },
    mod:     { title: 'Модерация', icon: '🛡️', class: '' },
    trainee: { title: 'Стажёры', icon: '📋', class: '' },
    builder: { title: 'Билдерский отдел', icon: '🔨', class: '' }
};

const DISCORD_RULES = [
    { num: 'I', icon: '🌐', title: 'Общие положения', rules: [
        { n: '1.1', t: 'Незнание правил не освобождает от ответственности.' },
        { n: '1.2', t: 'Администрация вправе принимать решения в нестандартных ситуациях.' },
        { n: '1.3', t: 'Попытка обойти правила рассматривается как нарушение.' },
        { n: '1.4', t: 'Все решения администрации должны быть аргументированы.' },
        { n: '1.5', t: 'Оскорбления или давление на администрацию запрещены.' }
    ]},
    { num: 'II', icon: '💬', title: 'Общение', rules: [
        { n: '2.1', t: 'Запрещены любые формы оскорблений и дискриминации.' },
        { n: '2.2', t: 'Запрещено разжигание конфликтов и провокации.' },
        { n: '2.3', t: 'Спам запрещён. К спаму относится:', list: ['повторение сообщений', 'чрезмерное использование эмодзи', 'флуд', 'массовое упоминание'] },
        { n: '2.4', t: 'Запрещено злоупотребление CAPS LOCK.' }
    ]},
    { num: 'III', icon: '🛡️', title: 'Безопасность', rules: [
        { n: '3.1', t: 'Запрещено публиковать вредоносные ссылки.' },
        { n: '3.2', t: 'Запрещено выдавать себя за администрацию.' },
        { n: '3.3', t: 'Запрещено распространять личную информацию.' }
    ]}
];

// ==========================================
// МОНИТОР
// ==========================================
function getMonitorState() {
    const s = DB.settings.serverStatus;
    const h = DB.settings.hostingStatus;
    if (h === 'UNPAID') return { color: 'var(--scp-red)', label: 'HOSTING_UNPAID', code: '<span class="c-hash"># [CRITICAL]</span>\n<span class="c-key">server:</span> <span class="c-val">' + s + '</span>\n<span class="c-key">hosting:</span> <span class="c-val">UNPAID</span>' };
    if (h === 'PROBLEMS') return { color: '#FF8C42', label: 'HOSTING_PROBLEMS', code: '<span class="c-hash"># [ERROR]</span>\n<span class="c-key">server:</span> <span class="c-val">' + s + '</span>' };
    if (s === 'OFFLINE') return { color: 'var(--scp-red)', label: 'SERVER_OFFLINE', code: '<span class="c-hash"># [OFFLINE]</span>\n<span class="c-key">server:</span> <span class="c-val">OFFLINE</span>' };
    return { color: 'var(--scp-green)', label: 'SYSTEM_NOMINAL', code: '<span class="c-hash"># [NOMINAL]</span>\n<span class="c-key">server:</span> <span class="c-val">ONLINE</span>\n<span class="c-key">uptime:</span> <span class="c-val">99.9%</span>' };
}

function renderMonitor() {
    const state = getMonitorState();
    return `
        <div class="server-monitor" style="--monitor-color: ${state.color};">
            <div class="monitor-head"><span class="mono">NEXUS_NETWORK</span><span class="mono live-indicator"><span class="live-dot"></span>LIVE</span></div>
            <div class="monitor-body">
                <div class="pulse-wrap"><div class="pulse-ring"></div><div class="pulse-dot"></div></div>
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
    if (content) {
        content.innerHTML = ''; // Очищаем
        try {
            routes[hash](content); // Рисуем
        } catch (err) {
            console.error("Ошибка рендера страницы:", err);
            content.innerHTML = `<div class="panel"><h2 style="color:red">Ошибка загрузки страницы</h2><p>Проверьте консоль (F12)</p></div>`;
        }
    } else {
        console.error("Не найден div с id='app-content'!");
    }
    
    if (window.innerWidth <= 900) {
        const sb = document.getElementById('sidebar');
        if (sb) sb.classList.remove('open');
    }
    applySettings();
    initMouseGlow(); 
}

// Запускаем когда DOM загрузится
window.addEventListener('load', () => { router(); });
window.addEventListener('hashchange', router);

function toggleSidebar() { 
    const sb = document.getElementById('sidebar');
    if (sb) sb.classList.toggle('open'); 
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
            ${n.image ? `<img src="${n.image}" style="width:100%; border-radius:8px; margin-top:10px;">` : ''}
        </div>
    `).join('');

    container.innerHTML = `
        <div class="grid-2 mb-20" style="gap: 30px; align-items: stretch;">
            <div class="panel" style="background: linear-gradient(180deg, rgba(88,153,249,0.1) 0%, transparent 100%); display: flex; flex-direction: column; justify-content: center;">
                <h1 style="font-size: 2.5rem; margin-bottom: 10px;">NEXUS • SCP-RP</h1>
                <p class="mono" style="color: var(--accent-start); margin-bottom: 20px;">> ДОБРО ПОЖАЛОВАТЬ В ТЕРМИНАЛ ФОНДА</p>
                <p>Официальный портал ролевого проекта по вселенной SCP. Ознакомьтесь с документацией перед началом игры.</p>
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

function renderRulesDiscord(container) {
    const sectionsHTML = DISCORD_RULES.map(sec => {
        const rulesHTML = sec.rules.map(r => {
            const numHTML = r.n ? `<div class="rule-num">${r.n}</div>` : '';
            let content = `<div class="rule-text">${r.t}`;
            if (r.list) content += '<ul class="rule-list">' + r.list.map(li => `<li>${li}</li>`).join('') + '</ul>';
            content += '</div>';
            return `<div class="rule-item">${numHTML}${content}</div>`;
        }).join('');
        return `
            <div class="rules-section">
                <div class="rules-section-header">
                    <span class="rules-section-icon">${sec.icon}</span>
                    <span class="rules-section-num">${sec.num}</span>
                    <span class="rules-section-title">${sec.title}</span>
                </div>
                <div class="rules-body">${rulesHTML}</div>
            </div>
        `;
    }).join('');
    container.innerHTML = `<h1 class="mb-20">Правила Discord</h1>${sectionsHTML}`;
}

function renderRulesRP(container) {
    container.innerHTML = `<h1 class="mb-20">Правила отыгровки (RP)</h1><div class="panel"><h2>1. Основы Roleplay</h2><p>1.1. FearRP — бойся за жизнь.</p><p>1.2. FailRP — запрещено нереалистичное поведение.</p></div>`;
}

function renderRulesAdmin(container) {
    container.innerHTML = `<h1 class="mb-20">Правила администрации</h1><div class="panel" style="text-align: center; padding: 50px;"><h2 style="border: none; color: var(--scp-yellow);">⚠ РАЗДЕЛ В РАЗРАБОТКЕ ⚠</h2></div>`;
}

function renderManagement(container) {
    const management = STAFF_LIST.filter(s => s.section === 'high');
    const cardsHTML = management.map(s => `
        <div class="mgmt-card">
            <div class="mgmt-level">${s.level}</div>
            <div class="mgmt-tag">// ${s.tag}</div>
            <div class="mgmt-role">${s.role}</div>
            <div class="mgmt-name">${s.name}</div>
        </div>
    `).join('');
    container.innerHTML = `<h1 class="mb-20">Руководство проекта</h1><div class="mgmt-grid">${cardsHTML}</div>`;
}

function renderStaff(container) {
    const order = ['high', 'admin', 'mod', 'trainee', 'builder'];
    const sectionsHTML = order.map(key => {
        const meta = STAFF_SECTIONS[key];
        const members = STAFF_LIST.filter(s => s.section === key);
        if (!members.length) return '';
        const rowsHTML = members.map(s => `
            <div class="staff-row">
                <div class="staff-num">${String(s.num).padStart(2, '0')}</div>
                <div class="staff-role-name">${s.role}</div>
                ${s.name ? `<div class="staff-person">${s.name}</div>` : `<div class="staff-vacant">VACANT</div>`}
            </div>
        `).join('');
        return `<div class="staff-section"><div class="staff-section-header ${meta.class}">${meta.title}</div>${rowsHTML}</div>`;
    }).join('');
    container.innerHTML = `<h1 class="mb-20">Персонал проекта</h1>${sectionsHTML}`;
}

function renderRoles(container) {
    container.innerHTML = `<h1 class="mb-20">Роли проекта</h1><div class="panel"><h2>// Список ролей (Заглушка)</h2><p>Описание появится позже.</p></div>`;
}

function renderDownload(container) {
    container.innerHTML = `
        <h1 class="mb-20">Скачать лаунчер</h1>
        <div class="panel">
            <h2>Версия 1.0.0</h2>
            <p>Сборка: Minecraft 1.20.1 Forge, моды на SCP, оптимизация.</p>
            <a href="#" class="btn btn-primary mt-15" onclick="alert('Ссылка появится позже')">СКАЧАТЬ (Windows)</a>
        </div>
    `;
}

function renderAbout(container) {
    container.innerHTML = `
        <h1 class="mb-20">О нас / Связь</h1>
        <div class="grid-3">
            <a href="#" class="panel" style="text-align: center; padding: 40px 20px;">
                <img src="icon-discord.png" alt="Discord" style="width: 48px; margin-bottom: 15px;">
                <h3>Discord</h3>
            </a>
            <a href="#" class="panel" style="text-align: center; padding: 40px 20px;">
                <img src="icon-telegram.png" alt="Telegram" style="width: 48px; margin-bottom: 15px;">
                <h3>Telegram</h3>
            </a>
            <a href="#" class="panel" style="text-align: center; padding: 40px 20px;">
                <img src="icon-vk.png" alt="ВКонтакте" style="width: 48px; margin-bottom: 15px;">
                <h3>ВКонтакте</h3>
            </a>
        </div>
    `;
}

// ==========================================
// АДМИНКА
// ==========================================
function isAdmin() { return sessionStorage.getItem('nexus_admin') === 'true'; }

function renderAdmin(container) {
    if (!isAdmin()) {
        window.location.hash = '#/home';
        return;
    }
    const newsList = DB.news.map(n => `
        <div class="news-admin-item">
            <div><strong>${n.title}</strong></div>
            <button class="btn btn-danger" onclick="deleteNews(${n.id})">✕</button>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="panel mb-20" style="border-left: 3px solid var(--scp-red);">
            <h1 style="color: var(--scp-red);">ADMIN CONTROL PANEL</h1>
            <button class="btn btn-outline mt-15" onclick="logout()">ЗАВЕРШИТЬ СЕАНС</button>
        </div>
        <div class="panel">
            <h2>// Создать новость</h2>
            <input type="text" id="newsTitle" class="input-field" placeholder="Заголовок">
            <textarea id="newsContent" class="input-field" placeholder="Текст"></textarea>
            <button class="btn btn-primary" onclick="createNews()">ОПУБЛИКОВАТЬ</button>
        </div>
        <div class="panel">
            <h2>// Список новостей</h2>
            ${newsList}
        </div>
    `;
}

function createNews() {
    const title = document.getElementById('newsTitle').value;
    const content = document.getElementById('newsContent').value;
    if (!title || !content) return alert('Заполните поля!');
    DB.news.unshift({ id: Date.now(), date: new Date().toLocaleDateString('ru-RU'), title, content, image: '' });
    saveData();
    router();
}

function deleteNews(id) {
    if (!confirm('Удалить?')) return;
    DB.news = DB.news.filter(n => n.id !== id);
    saveData();
    router();
}

function doLogin() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    const err = document.getElementById('loginError');
    if (user === CONFIG.ADMIN_LOGIN && pass === CONFIG.ADMIN_PASS) {
        sessionStorage.setItem('nexus_admin', 'true');
        document.getElementById('adminNavLink').style.display = 'flex';
        closeModal('loginModal');
        window.location.hash = '#/admin';
    } else {
        if(err) err.textContent = '> ОШИБКА ВХОДА';
    }
}

function logout() {
    sessionStorage.removeItem('nexus_admin');
    document.getElementById('adminNavLink').style.display = 'none';
    window.location.hash = '#/home';
    router();
}

// Безопасное вешание событий
const brandEl = document.querySelector('.brand');
if (brandEl) {
    brandEl.addEventListener('click', function(e) {
        if (e.ctrlKey && e.shiftKey) {
            e.preventDefault();
            if (isAdmin()) window.location.hash = '#/admin';
            else openModal('loginModal');
        }
    });
}

if (isAdmin()) {
    const al = document.getElementById('adminNavLink');
    if (al) al.style.display = 'flex';
}

function openModal(id) { const m = document.getElementById(id); if(m) m.classList.add('active'); }
function closeModal(id) { const m = document.getElementById(id); if(m) m.classList.remove('active'); }

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
