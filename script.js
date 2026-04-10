// =====================
//  Floating Hearts BG
// =====================
function createHeart() {
    const heart = document.createElement('i');
    heart.classList.add('fa-solid', 'fa-heart', 'floating-heart');
    heart.style.left = Math.random() * 100 + 'vw';
    const size = Math.random() * 18 + 10;
    heart.style.fontSize = size + 'px';
    const dur = Math.random() * 5 + 8;
    heart.style.animationDuration = dur + 's';
    heart.style.opacity = Math.random() * 0.5 + 0.1;
    document.querySelector('.background-animation').appendChild(heart);
    setTimeout(() => heart.remove(), dur * 1000);
}
setInterval(createHeart, 700);

// =====================
//  Mobile Menu
// =====================
document.getElementById('mobile-menu').addEventListener('click', () => {
    document.getElementById('nav-list').classList.toggle('open');
});
document.querySelectorAll('.nav-list a').forEach(a => {
    a.addEventListener('click', () => {
        document.getElementById('nav-list').classList.remove('open');
    });
});

// =====================
//  Active nav on scroll
// =====================
const sections = document.querySelectorAll('section[id], .hero');
const navLinks = document.querySelectorAll('.nav-list a');
window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 140) cur = sec.id;
    });
    navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
    });
});

// =====================
//  FLAMES GAME
// =====================
const flamesData = {
    F: { word: 'Friends',   color: '#4fc3f7', icon: 'fa-user-group',          desc: 'Great friends forever! 😊' },
    L: { word: 'Love',      color: '#ff4081', icon: 'fa-heart',                desc: 'True love is in the air! ❤️' },
    A: { word: 'Affection', color: '#ffb74d', icon: 'fa-face-smile-beam',      desc: 'Sweet affection between you two! 🥰' },
    M: { word: 'Marriage',  color: '#ce93d8', icon: 'fa-ring',                 desc: 'Wedding bells are ringing! 💍' },
    E: { word: 'Enemy',     color: '#ef5350', icon: 'fa-meteor',               desc: 'Uh oh… Frenemies? ⚔️' },
    S: { word: 'Sister',    color: '#81c784', icon: 'fa-hands-holding-child',  desc: 'Like a caring sibling bond! 👫' },
};

function calculateFlames() {
    const n1 = document.getElementById('name1').value.trim().toLowerCase().replace(/\s+/g, '');
    const n2 = document.getElementById('name2').value.trim().toLowerCase().replace(/\s+/g, '');

    if (!n1 || !n2) { alert('Please enter both names 💖'); return; }

    const container   = document.getElementById('flames-result-container');
    const loadingIcon = document.querySelector('.loading-hearts');
    const resultText  = document.getElementById('flames-result');
    const resultDesc  = document.getElementById('flames-desc');

    container.classList.remove('hidden');
    loadingIcon.classList.remove('hidden');
    resultText.innerHTML = '';
    resultDesc.innerHTML = '';

    // Reset letter styles
    'FLAMES'.split('').forEach(l => {
        const el = document.getElementById('fl-' + l);
        el.classList.remove('eliminated', 'winner');
        el.style.color = '';
    });

    // FLAMES logic
    let a1 = n1.split(''), a2 = n2.split('');
    for (let i = 0; i < a1.length; i++) {
        let j = a2.indexOf(a1[i]);
        if (j !== -1) { a1[i] = '#'; a2[j] = '#'; }
    }
    let count = a1.filter(c => c !== '#').length + a2.filter(c => c !== '#').length;
    if (count === 0) count = 1;

    let fl = ['F','L','A','M','E','S'];
    let idx = 0;
    const eliminated = [];

    const eliminateNext = () => {
        if (fl.length <= 1) return;
        idx = (idx + count - 1) % fl.length;
        const removed = fl.splice(idx, 1)[0];
        eliminated.push(removed);
        const el = document.getElementById('fl-' + removed);
        el.classList.add('eliminated');
        if (fl.length > 1) {
            if (idx >= fl.length) idx = 0;
            setTimeout(eliminateNext, 300);
        }
    };
    setTimeout(eliminateNext, 300);

    setTimeout(() => {
        loadingIcon.classList.add('hidden');
        const winner = fl[0] || 'E';
        const data = flamesData[winner];
        const el = document.getElementById('fl-' + winner);
        el.classList.add('winner');
        el.style.color = data.color;
        resultText.innerHTML = `<i class="fa-solid ${data.icon}"></i> ${data.word}`;
        resultText.style.color = data.color;
        resultDesc.innerHTML = data.desc;
    }, 300 * 5 + 400);
}

// =====================
//  CHAT
// =====================
const crushReplies = [
    "You always make me smile. 😊",
    "I was just thinking about you! ❤️",
    "Aww, that's so sweet of you 🥰",
    "You're the best part of my day 🌟",
    "Can't stop blushing! 🤭",
    "I love talking to you 💖",
    "You have my whole heart 💘",
    "Missing you already 🥺",
    "You make everything better 💗",
    "Stay with me forever? 💍"
];

function handleChatEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

function insertEmoji(emoji) {
    const inp = document.getElementById('chat-input');
    inp.value += emoji;
    inp.focus();
}

function sendMessage() {
    const inp  = document.getElementById('chat-input');
    const text = inp.value.trim();
    if (!text) return;

    appendMessage(text, 'sent');
    inp.value = '';

    const typing = document.getElementById('typing-indicator');
    setTimeout(() => {
        typing.classList.remove('hidden');
        scrollChat();
        setTimeout(() => {
            typing.classList.add('hidden');
            const reply = crushReplies[Math.floor(Math.random() * crushReplies.length)];
            appendMessage(reply, 'received');
        }, 1200 + Math.random() * 800);
    }, 400);
}

function appendMessage(text, type) {
    const box = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = 'message ' + type;
    div.textContent = text;
    box.appendChild(div);
    scrollChat();
}

function scrollChat() {
    const box = document.getElementById('chat-box');
    box.scrollTop = box.scrollHeight;
}

// =====================
//  KAVITHAI GENERATOR
// =====================
const kavithaigal = {
    kangal:   "கண்கள்:\nஉன் கண்களில் என்னை தொலைத்தேன்,\nகண்ணீர் துளியில் கூட உன் பிம்பம் கண்டேன்.\nவிழிகள் உறங்கினாலும்,\nஎன் கனவில் உன் நினைவுகள் விழித்திருக்கும்... ✨",
    sirippu:  "சிரிப்பு:\nஉன் ஒரு நொடி சிரிப்பினில்,\nஎன் பல நாள் கவலைகள் பறந்து போனதடி.\nநீ சிரித்தால் வானவில்லும்\nசற்று நிறம் மாறும்... 🌈",
    anbu:     "அன்பு:\nஅளக்க முடியாத கடலை விட,\nஆழமானது உன் மீது நான் கொண்ட அன்பு.\nஉன் மூச்சு காற்றிலும்\nஎன் பெயர் கேட்கும் நேரம் வருமா... ❤️",
    kadhal:   "காதல்:\nபிறந்ததில் இருந்து தேடிய தேடல் நீயடி,\nகிடைத்ததில் இருந்து தொலைத்ததும் நான் தானடி.\nஉயிருள்ள வரை\nஉன் நிழலாய் நான் இருப்பேன்... 🌹",
    azhagu:   "அழகு:\nஉலகில் உள்ள அழகெல்லாம்\nஉன் முகத்தில் குடி கொண்டதே!\nபூக்களும் உன்னை கண்டு\nசிறிது பொறாமை கொண்டதே... 🌸",
    vizhigal: "விழிகள்:\nவிழிகளில் நீ வரைந்த கோலம்,\nவிரல்களால் அழிக்கவே மனமில்லை.\nகண்ணை மூடினாலும் கூட,\nகனவில் நீயே வருகிறாய்... 💫",
    mazhai:   "மழை:\nமழை பெய்யும் போதெல்லாம்\nஉன் நினைவு மனதில் வழிகிறது.\nஒவ்வொரு துளியும் கேட்கிறது,\nநீ எங்கே என்று... 🌧️❤️",
};

function generateKavithai() {
    const topic  = document.getElementById('kavithai-topic').value.trim().toLowerCase();
    const output = document.getElementById('kavithai-output');

    if (!topic) { alert('Topic or name-ஐ enter பண்ணுங்க!'); return; }

    output.classList.remove('hidden');
    output.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Writing poetry...";

    setTimeout(() => {
        let result = kavithaigal[topic];
        if (!result) {
            for (const key in kavithaigal) {
                if (topic.includes(key) || key.includes(topic)) { result = kavithaigal[key]; break; }
            }
        }
        if (!result) {
            result = `${topic}...\nஉன் நினைவுகளால் நிரம்பியது என் நெஞ்சம்.\nநீயின்றி என் உலகமே இருண்டது போல,\nஎன் ஒளியாய் நீ வந்தாய்! ✨❤️`;
        }
        output.innerHTML = result.replace(/\n/g, '<br>');
    }, 900);
}

// =====================
//  LOVE LETTER
// =====================
function generateLetter() {
    const sender   = document.getElementById('sender-name').value.trim()   || 'Me';
    const receiver = document.getElementById('receiver-name').value.trim() || 'My Love';
    const mood     = document.getElementById('letter-mood').value;
    const output   = document.getElementById('letter-output');

    output.classList.remove('hidden');
    output.innerHTML = "<i class='fa-solid fa-pen fa-bounce'></i> Penning down feelings...";

    const letters = {
        romantic: `My Dearest ${receiver}, 🌹<br><br>From the moment you walked into my life, everything changed for the better. The colors became brighter, music sweeter, and my heart beats only for you. I find myself smiling for no reason, just thinking about your eyes. Every second spent with you is a treasure I hold close. I promise to love you more with every passing day.<br><br>Forever Yours,<br><strong>${sender}</strong> 🌹`,

        cute: `Hey ${receiver}! 🧸<br><br>Just wanted to pop in and say — you're literally the most amazing person ever! You're the peanut butter to my jelly, the cheese to my macaroni. Whenever I see your name light up on my phone, I get stupidly happy! Your laugh is my favourite sound in the whole world.<br><br>Hugs and Kisses,<br><strong>${sender}</strong> 💕`,

        emotional: `Dear ${receiver}, 🥺<br><br>Words fall short when I try to explain what you mean to me. You've held me on my darkest days and celebrated with me on the brightest. Simply knowing you are by my side gives me strength to face anything. I treasure every single moment we have together. You are my safe place, my home.<br><br>With all my love,<br><strong>${sender}</strong> ❤️`,
    };

    setTimeout(() => { output.innerHTML = letters[mood]; }, 1100);
}

// =====================
//  EXTRA FUN
// =====================
const cuteMessages = [
    "You are my favourite notification! 📱💛",
    "Are you a magician? Because whenever I look at you, everyone else disappears! 🎩✨",
    "I love you more than pizza. And I really love pizza! 🍕❤️",
    "If you were a vegetable, you'd be a cute-cumber! 🥒😆",
    "You stole my heart, but I'll let you keep it. 💘🔒",
    "I smile whenever I think of you. (Which is always!) 😊",
    "You are the reason I check my phone every 5 minutes! 📲🙈",
    "Life is better with you in it 🌟💖",
    "You make my heart do a little happy dance 💃🕺",
];

function generateCuteMessage() {
    const output = document.getElementById('cute-message-output');
    output.classList.remove('hidden');
    output.style.opacity = 0;
    output.textContent = cuteMessages[Math.floor(Math.random() * cuteMessages.length)];
    setTimeout(() => { output.style.transition = 'opacity 0.5s'; output.style.opacity = 1; }, 30);
}

// Daily quote on load
const quotes = [
    '"Love is not finding someone to live with, it\'s finding someone you can\'t live without."',
    '"Every love story is beautiful, but ours is my favourite."',
    '"The best thing to hold onto in life is each other."',
    '"To the world you may be one person, but to one person you are the world."',
    '"I look at you and see the rest of my life in front of my eyes."',
    '"In all the world, there is no heart for me like yours."',
    '"You are my today and all of my tomorrows."',
];
document.getElementById('daily-quote').textContent = quotes[new Date().getDay() % quotes.length];
