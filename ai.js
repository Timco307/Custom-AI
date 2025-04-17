const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Use a function to securely fetch the API key from a backend service
async function getApiKey() {
    const response = await fetch('/get-api-key'); // Replace with your secure backend endpoint
    if (!response.ok) throw new Error('Failed to fetch API key');
    return response.text(); // Ensure your backend returns the key as plain text
}

let messageHistory = [];

// Helper function to sanitize user input
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Helper function to update message history
function updateMessageHistory(role, content) {
    messageHistory.push({ role, content });
    if (messageHistory.length > 10) messageHistory.shift(); // Keep the last 10 messages
}

// Helper function to append messages to the chat container
function appendMessage(role, content) {
    const timestamp = new Date().toLocaleTimeString();
    const icon = role === 'user' ? 'guest.png' : 'logo.png';
    const altText = role === 'user' ? 'Guest Logo' : 'AI Logo';
    chatContainer.innerHTML += `
        <p>
            <img src="https://voucan-us4.github.io/ai/${icon}" alt="${altText}" style="width: 20px; height: 20px;">
            <span>${content}</span>
            <span style="font-size: small; color: gray;">[${timestamp}]</span>
        </p>`;
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Main function to send a message
async function sendMessage() {
    const userMessage = sanitizeInput(userInput.value.trim());
    if (userMessage === '') return;

    appendMessage('user', userMessage); // Display user message in the chat
    userInput.value = '';

    updateMessageHistory('user', userMessage);

    try {
        // Show loading indicator
        chatContainer.innerHTML += `<p>Loading...</p>`;
        const loadingElement = chatContainer.lastElementChild;

        // Fetch API key securely
        const apiKey = await getApiKey();

        // Prepare the payload for the API request
        const prevMessages = messageHistory.slice(-10);
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: prevMessages,
                temperature: 0.9,
                max_tokens: 1024,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        updateMessageHistory('assistant', aiResponse); // Add AI response to history
        appendMessage('assistant', aiResponse); // Display AI response in the chat

        console.log('Response received and displayed');
    } catch (error) {
        console.error('Error:', error);
        chatContainer.innerHTML += `<p><strong>Error:</strong> Unable to process your request. Please try again later.</p>`;
    } finally {
        // Remove loading indicator
        const loadingElement = chatContainer.querySelector('p:contains("Loading...")');
        if (loadingElement) loadingElement.remove();
    }
}

// Add event listeners for sending messages
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
