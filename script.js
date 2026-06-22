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
//  Tab Switching
// =====================
function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    hideAlert();
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

// =====================
//  Alert Box
// =====================
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
        email: user.email
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
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating...';

    setTimeout(() => {
        const users = getUsers();

        const exists = users.find(u => u.email === email || u.username === username);
        if (exists) {
            showAlert('Username or Email already registered!');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password // In a real app, never store plain password — for demo only
        };
        users.push(newUser);
        saveUsers(users);
        setSession(newUser);

        showAlert('Account created! Welcome to FLAMES Hub 💖', 'success');
        e.target.reset();

        setTimeout(() => {
            showDashboard(newUser);
        }, 1000);

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
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
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

    setTimeout(() => {
        const users = getUsers();
        const user = users.find(u =>
            (u.email === handle || u.username === handle) && u.password === password
        );

        if (!user) {
            showAlert('Invalid username/email or password!');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            return;
        }

        setSession(user);
        showAlert('Login successful! 🎉', 'success');
        e.target.reset();

        setTimeout(() => {
            showDashboard(user);
        }, 1000);

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
    }, 600);
}

// =====================
//  Show / Hide Dashboard
// =====================
function showDashboard(user) {
    const authCard = document.getElementById('auth-card');
    const dashboardCard = document.getElementById('dashboard-card');
    document.getElementById('welcome-message').textContent = `Welcome back, ${user.username}! ✨`;
    document.getElementById('profile-username').textContent = user.username;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-id').textContent = '#' + user.id;
    if (authCard) authCard.classList.add('hidden');
    if (dashboardCard) dashboardCard.classList.remove('hidden');
    hideAlert();
}

function handleLogout() {
    clearSession();
    const authCard = document.getElementById('auth-card');
    const dashboardCard = document.getElementById('dashboard-card');
    if (authCard) authCard.classList.remove('hidden');
    if (dashboardCard) dashboardCard.classList.add('hidden');
    switchTab('login');
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
