// Telegram Bot Credentials (Connected)
const BOT_TOKEN = '8720837827:AAGbNZfG7JiGSBs9jFqnJvh44qWP1SHFrWY';
const CHAT_ID = '8871892242';

// Elements
const galleryGrid = document.getElementById('galleryGrid');
const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const closeAbout = document.getElementById('closeAbout');

const userNameInput = document.getElementById('userName');
const userPhoneInput = document.getElementById('userPhone');
const clearIdentityBtn = document.getElementById('clearIdentityBtn');
const userMessageInput = document.getElementById('userMessage');
const sendBtn = document.getElementById('sendBtn');
const adminReplyDisplay = document.getElementById('adminReply');

// 1. Generate 20 Wallpapers Dynamically
for (let i = 1; i <= 20; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="images/${i}.jpg" alt="Mahadev Wallpaper ${i}" loading="lazy">
        <a href="images/${i}.jpg" download="Mahadev_Wallpaper_${i}.jpg" class="download-link">Download</a>
    `;
    galleryGrid.appendChild(card);
}

// 2. About Modal Window Logic
aboutBtn.onclick = () => aboutModal.style.display = 'flex';
closeAbout.onclick = () => aboutModal.style.display = 'none';
window.onclick = (e) => { if (e.target === aboutModal) aboutModal.style.display = 'none'; };

// 3. LocalStorage Identity Management
window.addEventListener('DOMContentLoaded', () => {
    userNameInput.value = localStorage.getItem('app_user_name') || '';
    userPhoneInput.value = localStorage.getItem('app_user_phone') || '';
    checkTelegramReplies();
});

userNameInput.oninput = () => localStorage.setItem('app_user_name', userNameInput.value);
userPhoneInput.oninput = () => localStorage.setItem('app_user_phone', userPhoneInput.value);

clearIdentityBtn.onclick = () => {
    localStorage.removeItem('app_user_name');
    localStorage.removeItem('app_user_phone');
    userNameInput.value = '';
    userPhoneInput.value = '';
};

// 4. Send Message to Telegram Bot
sendBtn.onclick = async () => {
    const name = userNameInput.value.trim() || 'Anonymous';
    const phone = userPhoneInput.value.trim() || 'Not Provided';
    const msg = userMessageInput.value.trim();

    if (!msg) return;

    const payloadText = `New Message from App:\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n💬 Message: ${msg}`;

    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: payloadText
            })
        });

        // Input reset immediately upon sending
        userMessageInput.value = '';
    } catch (err) {
        console.error('Failed to send message:', err);
    }
};

// 5. Poll Telegram for Developer Replies & Auto-Clear Output after 4 Seconds
let lastUpdateId = 0;

async function checkTelegramReplies() {
    try {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}`);
        const data = await res.json();

        if (data.ok && data.result.length > 0) {
            data.result.forEach(update => {
                lastUpdateId = update.update_id;
                if (update.message && update.message.text) {
                    displayReply(update.message.text);
                }
            });
        }
    } catch (err) {
        console.error('Error fetching replies:', err);
    }
}

function displayReply(text) {
    adminReplyDisplay.innerText = `Developer: ${text}`;
    
    // Auto-clear developer response after 4 seconds
    setTimeout(() => {
        adminReplyDisplay.innerText = 'No new replies from developer.';
    }, 4000);
}

// Check for updates every 5 seconds
setInterval(checkTelegramReplies, 5000);
