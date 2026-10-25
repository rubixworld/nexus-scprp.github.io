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
// БАЗА ДАННЫХ
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
    }
};

function saveData() {
    localStorage.setItem('nexus_news', JSON.stringify(DB.news));
    localStorage.setItem('nexus_settings', JSON.stringify(DB.settings));
}

// Защита от ошибок (проверяем, существует ли элемент перед изменением)
function applySettings() {
    const monIp = document.getElementById('mon-ip');
    if (monIp) monIp.textContent = DB.settings.ip;
    
    const monVer = document.getElementById('mon-ver');
    if (monVer) monVer.textContent = DB.settings.version;
    
    const mntMsg = document.getElementById('mntMessage');
    if (mntMsg) mntMsg.textContent = DB.settings.maintMsg;
    
    const mnt = document.getElementById('maintenance');
    const isAdmin = sessionStorage.getItem('nexus_admin') === 'true';
    if (mnt) {
        if (DB.settings.maintenance && !isAdmin) {
            mnt.classList.add('show');
        } else {
            mnt.classList.remove('show');
        }
    }
}

// ==========================================
// ПЕРСОНАЛ И ПРАВИЛА (Данные)
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
        { n: '1.2', t: 'Администрация вправе принимать решения в нестандартных ситуациях, которые прямо не описаны в правилах, если действия пользователя нарушают порядок или вредят сообществу.' },
        { n: '1.3', t: 'Попытка обойти правила, используя лазейки или буквальное толкование текста, рассматривается как нарушение.' },
        { n: '1.4', t: 'Все решения администрации должны быть аргументированы и соответствовать данным правилам.' },
        { n: '1.5', t: 'Оскорбления, угрозы или давление на администрацию с целью изменения наказания запрещены.' }
    ]},
    { num: 'II', icon: '💬', title: 'Общение', rules: [
        { n: '2.1', t: 'Запрещены любые формы оскорблений, унижения достоинства, травли (буллинга), преследования или дискриминации.' },
        { n: '2.2', t: 'Запрещено разжигание конфликтов, провокации, токсичное поведение и намеренное создание негативной атмосферы.' },
        { n: '2.3', t: 'Спам запрещён. К спаму относится:', list: ['повторение одинаковых сообщений', 'чрезмерное использование эмодзи', 'флуд бессмысленными сообщениями', 'массовое упоминание участников или ролей'] },
        { n: '2.4', t: 'Запрещено злоупотребление CAPS LOCK.' },
        { n: '2.5', t: 'Использование нецензурной лексики допускается только в разумных пределах и если она не направлена на унижение участников.' },
        { n: '2.6', t: 'Любые обсуждения политики, религии или иных потенциально конфликтных тем допускаются исключительно в специально предназначенных для этого каналах (если такие существуют).' }
    ]},
    { num: 'III', icon: '🛡️', title: 'Безопасность', rules: [
        { n: '3.1', t: 'Запрещено публиковать вредоносные ссылки, вирусы, IP-логгеры, фишинговые сайты и любое вредоносное ПО.' },
        { n: '3.2', t: 'Запрещено выдавать себя за администрацию, разработчиков проекта или сотрудников Discord.' },
        { n: '3.3', t: 'Запрещено распространять личную информацию других пользователей без их согласия.' },
        { n: '3.4', t: 'Любые попытки мошенничества, обмана, продажи аккаунтов или внутриигровых ценностей вне разрешённых администрацией способов запрещены.' }
    ]},
    { num: 'IV', icon: '📢', title: 'Контент', rules: [
        { n: '4.1', t: 'Любой публикуемый контент должен соответствовать Discord ToS и Community Guidelines.', sub: 'Запрещается публикация:', list: ['порнографических материалов', 'сцен реального насилия', 'материалов с участием несовершеннолетних', 'экстремистского контента', 'вредоносного ПО', 'незаконных материалов'] },
        { n: '4.2', t: 'NSFW-контент запрещён.' },
        { n: '4.3', t: 'Запрещено распространять материалы, нарушающие авторские права.' }
    ]},
    { num: 'V', icon: '📣', title: 'Реклама', rules: [
        { n: '5.1', t: 'Любая реклама сторонних Discord-серверов, проектов, Telegram-каналов, YouTube-каналов или иных ресурсов запрещена без разрешения администрации.' },
        { n: '5.2', t: 'Запрещена скрытая реклама через личные сообщения пользователям сервера.' }
    ]},
    { num: 'VI', icon: '🎭', title: 'Никнеймы и профили', rules: [
        { n: '6.1', t: 'Никнеймы и аватары не должны:', list: ['нарушать Discord ToS', 'содержать оскорбления', 'вводить пользователей в заблуждение', 'копировать администрацию'] },
        { n: '6.2', t: 'Администрация вправе потребовать изменить никнейм или аватар.' }
    ]},
    { num: 'VII', icon: '🎙️', title: 'Голосовые каналы', rules: [
        { n: '7.1', t: 'Запрещается:', list: ['шуметь', 'включать громкую музыку', 'использовать саундпады для помех', 'намеренно перебивать других пользователей'] },
        { n: '7.2', t: 'Запрещено заходить в голосовые каналы исключительно для создания помех.' }
    ]},
    { num: 'VIII', icon: '⛑️', title: 'Администрация', rules: [
        { n: '8.1', t: 'Администрация обязана соблюдать данные правила наравне с обычными пользователями.' },
        { n: '8.2', t: 'Администрация вправе применять наказание за действия, прямо не указанные в правилах, если они очевидно нарушают порядок сервера или Discord ToS.' },
        { n: '8.3', t: 'Злоупотребление полномочиями сотрудником администрации рассматривается отдельно руководством проекта.' }
    ]},
    { num: 'IX', icon: '⚖️', title: 'Наказания', rules: [
        { t: 'В зависимости от тяжести нарушения могут применяться:', list: ['Устное предупреждение', 'Официальное предупреждение', 'Мут', 'Временный бан', 'Перманентный бан'] },
        { t: 'При грубых нарушениях наказание может быть выдано сразу, без предварительных предупреждений.', warning: true }
    ]},
    { num: 'X', icon: '📜', title: 'Discord Terms of Service', rules: [
        { t: 'На сервере в обязательном порядке действуют:', links: [
            { label: "Discord's Terms of Service", url: 'https://discord.com/terms' },
            { label: 'Discord Community Guidelines', url: 'https://discord.com/guidelines' }
        ]},
        { t: 'Любое нарушение данных документов считается нарушением правил сервера независимо от того, указано ли оно отдельно выше.' }
    ]}
];

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
    if (content) {
        content.innerHTML = '';
        routes[hash](content);
    }
    
    if (window.innerWidth <= 900) document.getElementById('sidebar').classList.remove('open');
    applySettings();
    initMouseGlow(); 
}

window.addEventListener('hashchange', router);
window.addEventListener('load', () => { router(); });
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

function renderRulesDiscord(container) {
    const sectionsHTML = DISCORD_RULES.map(sec => {
        const rulesHTML = sec.rules.map(r => {
            const numHTML = r.n ? `<div class="rule-num">${r.n}</div>` : '';
            let content = `<div class="rule-text">${r.t}`;
            if (r.sub) content += `<span class="rules-sub-title">${r.sub}</span>`;
            if (r.list) content += '<ul class="rule-list">' + r.list.map(li => `<li>${li}</li>`).join('') + '</ul>';
            if (r.links) content += '<div class="rules-links">' + r.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener">📖 ${l.label}</a>`).join('') + '</div>';
            content += '</div>';
            const warn = r.warning ? `<div class="rule-warning" style="margin-left: 0; margin-top: 8px;">⚠ ${r.t}</div>` : '';
            return `<div class="rule-item">${numHTML}${content}${warn}</div>`;
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

    container.innerHTML = `
        <h1 class="mb-20">Правила Discord</h1>
        <div class="rules-intro">
            ⚖️ <strong>Добро пожаловать.</strong> Находясь на сервере, вы автоматически подтверждаете, что ознакомились с настоящими правилами и обязуетесь соблюдать как их, так и <a href="https://discord.com/guidelines" target="_blank" rel="noopener">Правила сообщества</a> и <a href="https://discord.com/terms" target="_blank" rel="noopener">Условия использования</a> Discord.
        </div>
        ${sectionsHTML}
        <div class="rules-footer">⚠️ Главная цель правил — обеспечить <strong>комфортное, безопасное и дружелюбное</strong> сообщество для всех участников проекта <strong>Nexus • SCP-RP</strong>.</div>
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
        </div>
    `;
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

    container.innerHTML = `
        <h1 class="mb-20">Руководство проекта</h1>
        <div class="rules-intro" style="border-left-color: var(--scp-red); background: linear-gradient(90deg, rgba(192,57,43,0.06), transparent);">
            🔒 <strong>Высший состав Фонда.</strong> Данные сотрудники обладают максимальным уровнем допуска и принимают стратегические решения по развитию проекта.
        </div>
        <div class="mgmt-grid">${cardsHTML}</div>
    `;
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
        return `<div class="staff-section"><div class="staff-section-header ${meta.class}"><span class="icon">${meta.icon}</span><span class="num">//</span><span>${meta.title}</span></div>${rowsHTML}</div>`;
    }).join('');

    container.innerHTML = `
        <h1 class="mb-20">Персонал проекта</h1>
        <div class="rules-intro">📋 <strong>Полный список персонала</strong> проекта Nexus • SCP-RP. Порядок отображения — от высшего к низшему.</div>
        ${sectionsHTML}
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
            <p>Nexus • SCP-RP — это проект, созданный энтузиастами для глубокой и атмосферной ролевой игры по вселенной SCP в Minecraft.</p>
        </div>
        <div class="grid-3">
            <a href="https://discord.gg/твой_инвайт" target="_blank" class="panel" style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px;">
                <img src="icon-discord.png" alt="Discord" style="width: 48px; height: 48px; margin-bottom: 15px; object-fit: contain;">
                <h3 style="color: #fff; margin-bottom: 5px;">Discord</h3>
                <p class="mono muted" style="margin: 0;">Основной хаб</p>
            </a>
            <a href="https://t.me/твой_канал" target="_blank" class="panel" style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px;">
                <img src="icon-telegram.png" alt="Telegram" style="width: 48px; height: 48px; margin-bottom: 15px; object-fit: contain;">
                <h3 style="color: #fff; margin-bottom: 5px;">Telegram</h3>
                <p class="mono muted" style="margin: 0;">Новости</p>
            </a>
            <a href="https://vk.com/твоя_группа" target="_blank" class="panel" style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px;">
                <img src="icon-vk.png" alt="ВКонтакте" style="width: 48px; height: 48px; margin-bottom: 15px; object-fit: contain;">
                <h3 style="color: #fff; margin-bottom: 5px;">ВКонтакте</h3>
                <p class="mono muted" style="margin: 0;">Сообщество</p>
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

        <div class="admin-section active" id="tab-news">
            <div class="grid-2">
                <div class="panel">
                    <h2>// Создать новость</h2>
                    <input type="text" id="newsTitle" class="input-field" placeholder="Заголовок">
                    <textarea id="newsContent" class="input-field" placeholder="Текст новости..."></textarea>
                    <input type="url" id="newsImage" class="input-field" placeholder="Ссылка на картинку (URL)">
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

        <div class="admin-section" id="tab-settings">
            <div class="panel">
                <h2>// Сервер и Монитор</h2>
                <div class="grid-2">
                    <div><label class="mono muted">IP Сервера</label><input type="text" id="setIp" class="input-field" value="${DB.settings.ip}"></div>
                    <div><label class="mono muted">Версия</label><input type="text" id="setVer" class="input-field" value="${DB.settings.version}"></div>
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
                <button class="btn btn-outline mt-15" onclick="exportData()">📥 ЭКСПОРТ</button>
                <button class="btn btn-outline mt-15" onclick="document.getElementById('importFile').click()">📤 ИМПОРТ</button>
                <input type="file" id="importFile" style="display:none" accept=".json" onchange="importData(event)">
            </div>
        </div>
    `;
}

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

if (isAdmin()) {
    const adminLink = document.getElementById('adminNavLink');
    if(adminLink) adminLink.style.display = 'flex';
}

function openModal(id) { 
    const m = document.getElementById(id);
    if(m) m.classList.add('active'); 
}
function closeModal(id) { 
    const m = document.getElementById(id);
    if(m) m.classList.remove('active'); 
}

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
