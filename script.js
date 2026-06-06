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
// Start floating hearts on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setInterval(createHeart, 800));
} else {
    setInterval(createHeart, 800);
}

// =====================
//  Authentication UI
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
//  API Integrations
// =====================
const API_URL = ''; // Relative path since static files are served on the same port

// Helper to safely parse JSON response or throw a friendly offline error
async function parseResponse(response) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }
    // Non-JSON response (e.g. 404 HTML page from static hosting like GitHub Pages, or server offline)
    throw new Error("Server response was not in JSON format. Please verify that node server.js is running.");
}

async function handleRegister(e) {
    e.preventDefault();
    hideAlert();
    
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating...';

    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await parseResponse(response);
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        
        // Success
        localStorage.setItem('flames_token', data.token);
        showAlert('Registration successful! Redirecting...', 'success');
        e.target.reset();
        
        setTimeout(() => {
            checkAuth();
        }, 1000);
        
    } catch (error) {
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
            showAlert("Cannot connect to server. Please check if your backend server (node server.js) is running.");
        } else {
            showAlert(error.message);
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
    }
}

async function handleLogin(e) {
    e.preventDefault();
    hideAlert();
    
    const handle = document.getElementById('login-handle').value.trim();
    const password = document.getElementById('login-password').value;
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ handle, password })
        });
        
        const data = await parseResponse(response);
        
        if (!response.ok) {
            throw new Error(data.message || 'Invalid credentials');
        }
        
        // Success
        localStorage.setItem('flames_token', data.token);
        showAlert('Login successful! Redirecting...', 'success');
        e.target.reset();
        
        setTimeout(() => {
            checkAuth();
        }, 1000);
        
    } catch (error) {
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
            showAlert("Cannot connect to server. Please check if your backend server (node server.js) is running.");
        } else {
            showAlert(error.message);
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
    }
}

async function checkAuth() {
    const token = localStorage.getItem('flames_token');
    const authCard = document.getElementById('auth-card');
    const dashboardCard = document.getElementById('dashboard-card');
    
    if (!token) {
        // No session: Show auth card, hide dashboard
        if (authCard) authCard.classList.remove('hidden');
        if (dashboardCard) dashboardCard.classList.add('hidden');
        hideAlert();
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/user/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const user = await parseResponse(response);
        
        if (!response.ok) {
            throw new Error('Token verification failed');
        }
        
        // Populate and display dashboard
        document.getElementById('welcome-message').textContent = `Welcome back, ${user.username}! ✨`;
        document.getElementById('profile-username').textContent = user.username;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-id').textContent = user._id;
        
        if (authCard) authCard.classList.add('hidden');
        if (dashboardCard) dashboardCard.classList.remove('hidden');
        
    } catch (error) {
        console.error('Session error:', error);
        localStorage.removeItem('flames_token');
        if (authCard) authCard.classList.remove('hidden');
        if (dashboardCard) dashboardCard.classList.add('hidden');
    }
}

function handleLogout() {
    localStorage.removeItem('flames_token');
    checkAuth();
    switchTab('login');
}

// Check auth status on page load
window.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});
