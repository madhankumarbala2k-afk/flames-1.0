// =====================
//  Floating Hearts BG
// =====================
function createHeart() {
    const bgContainer = document.getElementById('bg-anim');
    if (!bgContainer) return;
    const heart = document.createElement('i');
    heart.classList.add('fa-solid', 'fa-heart', 'floating-heart');
    heart.style.left = Math.random() * 100 + 'vw';
    const size = Math.random() * 18 + 10;
    heart.style.fontSize = size + 'px';
    const dur = Math.random() * 5 + 8;
    heart.style.animationDuration = dur + 's';
    heart.style.opacity = Math.random() * 0.4 + 0.1;
    bgContainer.appendChild(heart);
    setTimeout(() => heart.remove(), dur * 1000);
}
setInterval(createHeart, 800);

// =====================
//  Tab Switching (Auth)
// =====================
function switchTab(tab) {
    hideAlert();
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
    }
}

function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alert-box');
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `alert-box ${type}`;
}
function hideAlert() {
    const alertBox = document.getElementById('alert-box');
    if (!alertBox) return;
    alertBox.textContent = '';
    alertBox.className = 'alert-box hidden';
}

// =====================
//  LocalStorage Helpers
// =====================
function getUsers() {
    return JSON.parse(localStorage.getItem('flames_users') || '[]');
}
function saveUsers(users) {
    localStorage.setItem('flames_users', JSON.stringify(users));
}
function setSession(user) {
    localStorage.setItem('flames_session', JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
        since: user.since
    }));
}
function getSession() {
    const s = localStorage.getItem('flames_session');
    return s ? JSON.parse(s) : null;
}
function clearSession() {
    localStorage.removeItem('flames_session');
}

// =====================
//  Register
// =====================
function handleRegister(e) {
    e.preventDefault();
    hideAlert();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const orig = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating...';

    setTimeout(() => {
        const users = getUsers();
        const exists = users.find(u => u.email === email || u.username === username);
        if (exists) {
            showAlert('Username or Email already registered!');
            submitBtn.disabled = false;
            submitBtn.innerHTML = orig;
            return;
        }
        const newUser = {
            id: Date.now().toString(),
            username, email, password,
            since: new Date().toLocaleDateString('en-IN')
        };
        users.push(newUser);
        saveUsers(users);
        setSession(newUser);
        showAlert('Account created! Welcome 💖', 'success');
        e.target.reset();
        setTimeout(() => showDashboard(newUser), 900);
        submitBtn.disabled = false;
        submitBtn.innerHTML = orig;
    }, 600);
}

// =====================
//  Login
// =====================
function handleLogin(e) {
    e.preventDefault();
    hideAlert();
    const handle = document.getElementById('login-handle').value.trim();
    const password = document.getElementById('login-password').value;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const orig = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

    setTimeout(() => {
        const users = getUsers();
        const user = users.find(u =>
            (u.email === handle || u.username === handle) && u.password === password
        );
        if (!user) {
            showAlert('Invalid username/email or password!');
            submitBtn.disabled = false;
            submitBtn.innerHTML = orig;
            return;
        }
        setSession(user);
        showAlert('Login successful! 🎉', 'success');
        e.target.reset();
        setTimeout(() => showDashboard(user), 900);
        submitBtn.disabled = false;
        submitBtn.innerHTML = orig;
    }, 600);
}

// =====================
//  Show Dashboard
// =====================
function showDashboard(user) {
    document.getElementById('page-auth').classList.add('hidden');
    document.getElementById('page-dashboard').classList.remove('hidden');
    document.getElementById('nav-user-area').classList.remove('hidden');
    document.getElementById('nav-username').textContent = '👤 ' + user.username;
    document.getElementById('profile-welcome').textContent = `Hi, ${user.username}! ✨`;
    document.getElementById('profile-username').textContent = user.username;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-since').textContent = user.since || 'Today';
    hideAlert();
    showGameTab('flames');
}

// =====================
//  Logout
// =====================
function handleLogout() {
    clearSession();
    document.getElementById('page-auth').classList.remove('hidden');
    document.getElementById('page-dashboard').classList.add('hidden');
    document.getElementById('nav-user-area').classList.add('hidden');
    switchTab('login');
}

// =====================
//  Game Tab Switching
// =====================
function showGameTab(tab) {
    ['flames', 'kavithai', 'profile'].forEach(t => {
        document.getElementById('section-' + t).classList.add('hidden');
        document.getElementById('gtab-' + t).classList.remove('active');
    });
    document.getElementById('section-' + tab).classList.remove('hidden');
    document.getElementById('gtab-' + tab).classList.add('active');
}

// =====================
//  FLAMES Calculator
// =====================
function calcFlames() {
    const n1 = document.getElementById('name1').value.trim();
    const n2 = document.getElementById('name2').value.trim();
    const resultDiv = document.getElementById('flames-result');

    if (!n1 || !n2) {
        resultDiv.className = 'flames-result';
        resultDiv.innerHTML = '<span style="color:#ff8a80">⚠️ Please enter both names!</span>';
        return;
    }

    let arr1 = n1.toLowerCase().replace(/\s/g, '').split('');
    let arr2 = n2.toLowerCase().replace(/\s/g, '').split('');

    arr1.forEach((c, i) => {
        const idx = arr2.indexOf(c);
        if (idx !== -1) { arr1[i] = '#'; arr2[idx] = '#'; }
    });

    let count = arr1.filter(c => c !== '#').length + arr2.filter(c => c !== '#').length;

    if (count === 0) count = 1;

    let fl = ['F', 'L', 'A', 'M', 'E', 'S'];
    let idx = 0;
    while (fl.length > 1) {
        idx = (idx + count - 1) % fl.length;
        fl.splice(idx, 1);
        if (idx >= fl.length) idx = 0;
    }

    const resMap = {
        F: { label: 'Friends 👫', emoji: '🤝', color: '#64b5f6', desc: 'You two are great friends!' },
        L: { label: 'Love 💕', emoji: '❤️', color: '#ff4081', desc: 'You are deeply in love!' },
        A: { label: 'Affection 🥰', emoji: '🥰', color: '#f48fb1', desc: 'There is strong affection between you!' },
        M: { label: 'Marriage 💍', emoji: '💍', color: '#ffd700', desc: 'You are meant to be together!' },
        E: { label: 'Enemy 😤', emoji: '⚡', color: '#ef5350', desc: 'There is rivalry between you!' },
        S: { label: 'Sister/Brother 👨‍👩‍👧', emoji: '🫂', color: '#ab47bc', desc: 'You share a sibling-like bond!' }
    };

    const res = resMap[fl[0]] || resMap['F'];

    resultDiv.className = 'flames-result show';
    resultDiv.innerHTML = `
        <div class="result-emoji">${res.emoji}</div>
        <div class="result-label" style="color:${res.color}">${res.label}</div>
        <div class="result-names">${n1} &amp; ${n2}</div>
        <div class="result-desc">${res.desc}</div>
    `;
}

// =====================
//  Kavithai Generator
// =====================
const kavithaiList = {
    default: [
        `உன் நினைவுகளால் நிரம்பியது என் நெஞ்சம்,\nநீயின்றி என் உலகமே இருண்டது போல்,\nஒரு விழியில் என் உலகை மாற்றினாய் நீ! 💖`,
        `காற்றில் உன் பெயர் கேட்கிறேன்,\nமழையில் உன் நினைவு தெரிகிறது,\nஒவ்வொரு நொடியும் உன்னை நினைக்கிறேன்! 🌧️❤️`,
        `உன் புன்னகை என் வாழ்வின் வெளிச்சம்,\nஉன் குரல் என் மனதின் இசை,\nநீயே என் உயிரின் உதிர்வு! 🌸`,
    ],
    love: [
        `காதல் என்பது வலி அல்ல,\nகாதல் என்பது உயிர்ப்பு,\nநீ என் காதலின் முதல் மழை! 💕`,
        `உன்னை நேசிக்கிறேன் என்று சொல்ல வார்த்தை போதாது,\nஆயிரம் கவிதை எழுதினாலும் தீராது,\nமௌனமே என் காதலின் மொழி! ❤️`,
    ],
    rain: [
        `மழை வரும்போது உன்னை நினைக்கிறேன்,\nதுளி துளியாய் உன் நினைவுகள் பெய்கின்றன,\nவானம் போல் உன்னில் மூழ்குகிறேன்! 🌧️💙`,
    ]
};

function genKavithai() {
    const topic = document.getElementById('kav-topic').value.trim().toLowerCase();
    const outputDiv = document.getElementById('kav-output');

    if (!topic) {
        outputDiv.className = 'kav-output';
        outputDiv.innerHTML = '<span style="color:#ff8a80">⚠️ Please enter a topic!</span>';
        return;
    }

    let poems = kavithaiList.default;
    if (topic.includes('love') || topic.includes('காதல')) poems = kavithaiList.love;
    else if (topic.includes('rain') || topic.includes('மழை')) poems = kavithaiList.rain;

    const chosen = poems[Math.floor(Math.random() * poems.length)];
    const lines = chosen.split('\n').map(l => `<p>${l}</p>`).join('');

    outputDiv.className = 'kav-output show';
    outputDiv.innerHTML = `
        <div class="kav-header"><i class="fa-solid fa-feather-pointed"></i> ${topic.charAt(0).toUpperCase() + topic.slice(1)} Kavithai</div>
        <div class="kav-poem">${lines}</div>
    `;
}

// =====================
//  Auto-login on load
// =====================
window.addEventListener('DOMContentLoaded', () => {
    const session = getSession();
    if (session) {
        showDashboard(session);
    }
});
