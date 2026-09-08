const BOT_TOKEN = '8720837827:AAGbNZfG7JiGSBs9jFqnJvh44qWP1SHFrWY';
const CHAT_ID = '8871892242';

const userIdentityInput = document.getElementById('userIdentity');
const userMessageInput = document.getElementById('userMessage');
const sendBtn = document.getElementById('sendBtn');
const statusNotice = document.getElementById('statusNotice');

let hideTimer = null;
let lastUpdateId = 0;

// Auto-Load & Auto-Save User Identity in LocalStorage
window.addEventListener('DOMContentLoaded', () => {
    if (userIdentityInput) {
        const savedIdentity = localStorage.getItem('app_user_identity');
        if (savedIdentity) {
            userIdentityInput.value = savedIdentity;
        } else {
            // Default identity if not provided
            const randomId = 'User_' + Math.floor(1000 + Math.random() * 9000);
            userIdentityInput.value = randomId;
            localStorage.setItem('app_user_identity', randomId);
        }

        userIdentityInput.oninput = () => {
            localStorage.setItem('app_user_identity', userIdentityInput.value.trim());
        };
    }
    checkTelegramReplies();
});

// Auto Hide Logic (3.5 to 4 Seconds or Instant Replace)
function showNoticeWithAutoHide(text) {
    if (hideTimer) clearTimeout(hideTimer); // Naya message bhejte hi purana hide/cancel ho jayega
    
    statusNotice.innerText = text;
    
    hideTimer = setTimeout(() => {
        statusNotice.innerText = 'Send a message to start conversation.';
    }, 3800);
}

// Send Message to Developer via Telegram
if (sendBtn) {
    sendBtn.onclick = async () => {
        const identity = userIdentityInput.value.trim() || 'Anonymous User';
        const msg = userMessageInput.value.trim();

        if (!msg) return;

        const payloadText = `📩 App Message:\n👤 Identity: ${identity}\n💬 Message: ${msg}`;

        // Screen pe turant show hoga
        showNoticeWithAutoHide(`You (${identity}): ${msg}`);

        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: payloadText
                })
            });

            userMessageInput.value = '';
        } catch (err) {
            console.error('Failed to send:', err);
        }
    };
}

// Fetch Developer Replies from Telegram
async function checkTelegramReplies() {
    try {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}`);
        const data = await res.json();

        if (data.ok && data.result.length > 0) {
            data.result.forEach(update => {
                lastUpdateId = update.update_id;
                if (update.message && update.message.text) {
                    showNoticeWithAutoHide(`Developer: ${update.message.text}`);
                }
            });
        }
    } catch (err) {
        console.error('Error fetching replies:', err);
    }
}

setInterval(checkTelegramReplies, 5000);
