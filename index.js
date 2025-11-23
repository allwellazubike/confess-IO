document.addEventListener('DOMContentLoaded', () => {
    // 1. Safe Socket Connection
    let socket = null;
    try {
        if (typeof io !== 'undefined') {
            socket = io();
        } else {
            console.warn("Socket.io not loaded. UI will work, but messages won't send.");
        }
    } catch (e) {
        console.error("Socket connection failed:", e);
    }

    // 2. Elements
    const messageInput = document.getElementById('messageInput');
    const charCount = document.getElementById('charCount');
    const socialProof = document.getElementById('socialProof');
    const getMessagesBtn = document.getElementById('getMessagesBtn');
    const sendBtn = document.getElementById('sendBtn');

    // 3. Character Counter
    if (charCount && messageInput) {
        messageInput.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }

    // 4. Focus Logic (The Fix)
    messageInput.addEventListener('focus', function() {
        console.log("Input focused - swapping buttons"); // Debug log
        if (socialProof) socialProof.classList.add('hidden');
        if (getMessagesBtn) getMessagesBtn.classList.add('hidden');
        if (sendBtn) sendBtn.classList.remove('hidden');
    });

    // 5. Blur Logic (With safety timeout to allow clicks)
    messageInput.addEventListener('blur', function() {
        // Small delay to check if text is truly empty
        setTimeout(() => {
            if (this.value.trim() === '') {
                if (socialProof) socialProof.classList.remove('hidden');
                if (getMessagesBtn) getMessagesBtn.classList.remove('hidden');
                if (sendBtn) sendBtn.classList.add('hidden');
            }
        }, 100);
    });

    // 6. Send Logic
    function sendMessage() {
        const text = messageInput.value;
        if (text.trim()) {
            if (socket) {
                socket.emit('new_confession', text);
            } else {
                alert("Message would be sent here (Server not connected)");
            }
            
            messageInput.value = '';
            if (charCount) charCount.textContent = '0';
            
            // Redirect to board
            window.location.href = 'board.html';
        }
    }

    if (sendBtn) sendBtn.addEventListener('click', sendMessage);

    // Enter Key Support
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Navigation
    if (getMessagesBtn) {
        getMessagesBtn.addEventListener('click', function() {
            window.location.href = 'board.html';
        });
    }
});