 const messageInput = document.getElementById('messageInput');
        const socialProof = document.getElementById('socialProof');
        const getMessagesBtn = document.getElementById('getMessagesBtn');
        const sendBtn = document.getElementById('sendBtn');

        // When user clicks/focuses on the textarea
        messageInput.addEventListener('focus', function() {
            // Hide the social proof and original button
            socialProof.classList.add('hidden');
            getMessagesBtn.classList.add('hidden');
            
            // Show the Send button
            sendBtn.classList.remove('hidden');
        });

        // Optional: If you want it to reset when they click away and the box is empty
        messageInput.addEventListener('blur', function() {
            if(this.value.trim() === '') {
                socialProof.classList.remove('hidden');
                getMessagesBtn.classList.remove('hidden');
                sendBtn.classList.add('hidden');
            }
        });