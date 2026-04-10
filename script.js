// Floating hearts background animation
function createHeart() {
    const heart = document.createElement('i');
    heart.classList.add('fa-solid', 'fa-heart', 'floating-heart');
    
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 5 + 8 + 's'; // 8-13s
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heart.style.opacity = Math.random() * 0.5 + 0.2;
    
    document.querySelector('.background-animation').appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 13000);
}

setInterval(createHeart, 800);

// Mobile menu toggle
document.getElementById('mobile-menu').addEventListener('click', () => {
    document.getElementById('nav-list').classList.toggle('active');
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.nav-list a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        
        if(window.innerWidth <= 768) {
            document.getElementById('nav-list').classList.remove('active');
        }
    });
});

// 1. FLAMES Game Logic
function calculateFlames() {
    let name1 = document.getElementById('name1').value.trim().toLowerCase().replace(/\s+/g, '');
    let name2 = document.getElementById('name2').value.trim().toLowerCase().replace(/\s+/g, '');

    if (name1 === '' || name2 === '') {
        alert("Please enter both names 💖");
        return;
    }

    // Show loading
    const resultContainer = document.getElementById('flames-result-container');
    const resultText = document.getElementById('flames-result');
    const resultDesc = document.getElementById('flames-desc');
    const loadingIcon = document.querySelector('.loading-hearts');
    
    resultContainer.classList.remove('hidden');
    loadingIcon.classList.remove('hidden');
    resultText.innerHTML = '';
    resultDesc.innerHTML = '';

    // Logic
    let arr1 = name1.split('');
    let arr2 = name2.split('');

    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
            if (arr1[i] === arr2[j]) {
                arr1[i] = '#';
                arr2[j] = '#';
                break;
            }
        }
    }

    let remainingCount = 0;
    arr1.forEach(char => { if (char !== '#') remainingCount++; });
    arr2.forEach(char => { if (char !== '#') remainingCount++; });

    const flames = ["Friends", "Love", "Affection", "Marriage", "Enemy", "Sister"];
    const colors = ["#4fc3f7", "#ff4081", "#ffb74d", "#b39ddb", "#f44336", "#81c784"];
    const icons = ["fa-user-group", "fa-heart", "fa-face-smile-beam", "fa-ring", "fa-meteor", "fa-hands-holding-child"];
    
    let flamesArr = ['F', 'L', 'A', 'M', 'E', 'S'];
    let index = 0;

    if (remainingCount > 0) {
        while (flamesArr.length > 1) {
            index = (index + remainingCount - 1) % flamesArr.length;
            flamesArr.splice(index, 1);
        }
    } else {
        // if same name or complete anagram, default to Enemy or something funny
        flamesArr = ['E']; 
    }
    
    const finalLetter = flamesArr[0];
    const mapIndex = ['F', 'L', 'A', 'M', 'E', 'S'].indexOf(finalLetter);
    const finalWord = flames[mapIndex];
    const finalColor = colors[mapIndex];
    const finalIcon = icons[mapIndex];

    setTimeout(() => {
        loadingIcon.classList.add('hidden');
        resultText.style.color = finalColor;
        resultText.innerHTML = `<i class="fa-solid ${finalIcon}"></i> ${finalWord}`;
        
        const descriptions = [
            "Good friends everywhere! 😊",
            "True love is in the air! ❤️",
            "Sweet affection between you two! 🥰",
            "Wedding bells are ringing! 💍",
            "Uh oh... Frenemies? ⚔️",
            "Like a caring sibling bond! 👫"
        ];
        resultDesc.innerHTML = descriptions[mapIndex];
    }, 1500);
}

// 2. Chatting Feature Logic
const chatResponses = [
    "You always make me smile. 😊",
    "I was just thinking about you! ❤️",
    "Aww, that's so sweet of you. 🥰",
    "You're the best part of my day. 🌟",
    "Can't stop blushing! 🤭",
    "I love talking to you. 💖",
    "You have my whole heart. 💘"
];

function handleChatEnter(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}

function insertEmoji(emoji) {
    const input = document.getElementById('chat-input');
    input.value += emoji;
    input.focus();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const msgText = input.value.trim();
    if (!msgText) return;

    appendMessage(msgText, 'sent');
    input.value = '';

    // Scroll to bottom
    const chatBox = document.getElementById('chat-box');
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simulate typing
    const typingIndicator = document.getElementById('typing-indicator');
    setTimeout(() => {
        typingIndicator.classList.remove('hidden');
        chatBox.scrollTop = chatBox.scrollHeight;
        
        setTimeout(() => {
            typingIndicator.classList.add('hidden');
            const randomReply = chatResponses[Math.floor(Math.random() * chatResponses.length)];
            appendMessage(randomReply, 'received');
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 1500 + Math.random() * 1000);
    }, 500);
}

function appendMessage(text, type) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
}

// 3. Kavithai Generator Logic
const tamilKavithaigal = {
    'kangal': "கண்கள்:\nஉன் கண்களில் என்னை தொலைத்தேன்,\nகண்ணீர் துளியில் கூட உன் பிம்பம் கண்டேன்.\nவிழிகள் உறங்கினாலும்,\nஎன் கனவில் உன் நினைவுகள் விழித்திருக்கும்... ✨",
    'sirippu': "சிரிப்பு:\nஉன் ஒரு நொடி சிரிப்பினில்,\nஎன் பல நாள் கவலைகள் பறந்து போனதடி.\nநீ சிரித்தால் வானவில்லும்\nசற்று நிறம் மாறும்... 🌈",
    'anbu': "அன்பு:\nஅளக்க முடியாத கடலை விட,\nஆழமானது உன் மீது நான் கொண்ட அன்பு.\nஉன் மூச்சு காற்றிலும்\nஎன் பெயர் கேட்கும் நேரம் வருமா... ❤️",
    'kadhal': "காதல்:\nபிறந்ததில் இருந்து தேடிய தேடல் நீயடி,\nகிடைத்ததில் இருந்து தொலைத்ததும் நான் தானடி.\nஉயிருள்ள வரை\nஉன் நிழலாய் நான் இருப்பேன்... 🌹",
    'azhagu': "அழகு:\nஉலகில் உள்ள அழகெல்லாம்\nஉன் முகத்தில் குடி கொண்டதே!\nபூக்களும் உன்னை கண்டு\nசிறிது பொறாமை கொண்டதே... 🌸",
    'default': "உன் பெயர் சொன்னால்\nஎன் இதயம் சற்று வேகமாக துடிக்குதடி,\nஇத்தனை காலம் எங்கு சென்றாய்\nஎன்னை தனிமையில் விட்டு... 🥺💕"
};

function generateKavithai() {
    let topic = document.getElementById('kavithai-topic').value.trim().toLowerCase();
    const outputBox = document.getElementById('kavithai-output');
    
    if (topic === '') {
        alert("Please enter a name or topic!");
        return;
    }

    outputBox.classList.remove('hidden');
    outputBox.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Writing poetry...";

    setTimeout(() => {
        let result = tamilKavithaigal[topic];
        
        // Match partial topics
        if (!result) {
            for (let key in tamilKavithaigal) {
                if (topic.includes(key) || key.includes(topic)) {
                    result = tamilKavithaigal[key];
                    break;
                }
            }
        }

        if (!result) {
            // Generate a default dynamic one based on input
            result = `${topic}...\nஉன் நினைவுகளால் நிரம்பியது என் நெஞ்சம்.\nநீயின்றி என் உலகமே இருண்டது போல,\nஎன் ஒளியாய் நீ வந்தாய்! ✨❤️`;
        }

        outputBox.innerHTML = result.replace(/\n/g, '<br>');
    }, 1000);
}

// 4. Love Letter Generator Logic
function generateLetter() {
    const sender = document.getElementById('sender-name').value.trim() || 'Me';
    const receiver = document.getElementById('receiver-name').value.trim() || 'My Love';
    const mood = document.getElementById('letter-mood').value;
    const outputBox = document.getElementById('letter-output');

    outputBox.classList.remove('hidden');
    outputBox.innerHTML = "<i class='fa-solid fa-pen fa-bounce'></i> Penning down feelings...";

    setTimeout(() => {
        let letter = "";
        
        if (mood === 'romantic') {
            letter = `My Dearest ${receiver},<br><br>From the moment you walked into my life, everything changed for the better. The colors are brighter, the music is sweeter, and my heart beats only for you. I find myself smiling for no reason, just thinking about your eyes. I promise to love you more with every passing day.<br><br>Forever Yours,<br>${sender} 🌹`;
        } else if (mood === 'cute') {
            letter = `Hey ${receiver}! 🧸<br><br>Just wanted to pop in and tell you that you're literally the most amazing person ever! You're the peanut butter to my jelly, the cheese to my macaroni. Whenever I see your name light up on my phone, I get stupidly happy. Don't ever change because you are perfectly perfect.<br><br>Hugs and Kisses,<br>${sender} 💕`;
        } else if (mood === 'emotional') {
            letter = `Dear ${receiver}, 🥺<br><br>Words fall short when I try to explain what you mean to me. You've held me on my darkest days and celebrated with me on my brightest. Simply knowing you are by my side gives me the strength to face anything. I treasure every single moment we spend together. You are my safe place.<br><br>With all my love,<br>${sender} ❤️`;
        }

        outputBox.innerHTML = letter;
    }, 1200);
}

// 5. Extra Fun Logic
const cuteMessages = [
    "You are my favorite notification! 📱💛",
    "Are you a magician? Because whenever I look at you, everyone else disappears! 🎩✨",
    "I love you more than pizza. And I really love pizza! 🍕❤️",
    "If you were a vegetable, you'd be a cute-cumber! 🥒😆",
    "You stole my heart, but I'll let you keep it. 💘🔒",
    "I smile whenever I think of you. (which is all the time) 😊",
    "You are the reason why I check my phone every 5 minutes! 📲🙈"
];

function generateCuteMessage() {
    const output = document.getElementById('cute-message-output');
    const randomMsg = cuteMessages[Math.floor(Math.random() * cuteMessages.length)];
    
    output.classList.remove('hidden');
    output.style.opacity = '0';
    output.textContent = randomMsg;
    
    setTimeout(() => {
        output.style.opacity = '1';
    }, 50);
}

// Set daily quote on load
window.onload = () => {
    const quotes = [
        '"Love is not finding someone to live with, it\'s finding someone you can\'t live without."',
        '"Every love story is beautiful, but ours is my favorite."',
        '"The best thing to hold onto in life is each other."',
        '"To the world you may be one person, but to one person you are the world."',
        '"I look at you and see the rest of my life in front of my eyes."'
    ];
    
    const day = new Date().getDay(); 
    document.getElementById('daily-quote').textContent = quotes[day % quotes.length];
};
