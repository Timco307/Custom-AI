const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

const apiKey = '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';
let messageHistory = [];

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage === '') return;

    chatContainer.innerHTML += `<p><img src="https://voucan-us4.github.io/ai/guest.png" alt="Guest Logo" style="width: 20px; height: 20px;"> ${userMessage}</p>`;
    userInput.value = '';

    messageHistory.push({ role: 'user', content: userMessage });
    if (messageHistory.length > 10) messageHistory.shift(); 

    try {
        console.log('Sending request to Groq API...');
        const prevmessages = messageHistory.slice(-10);

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
  "model": "llama-3.3-70b-versatile",
  "messages": [
    {
      "role": "user", 
      "content": "🚦 **START – Timmy307 AI MENU (v2.45)** 🚦 📌 **Welcome to the Timmy307 AI MENU!** To begin setup, **just say "start"**, and I’ll guide you through the process. SYSTEM: Once the user types `"start"`, guide them through the following in order:1️⃣ **Set Chat Title** – What would you like to name this chat? _(Defaults to "Name Chat" unless the user selects a custom name)_2️⃣ **Main Topic** – What's the focus of this session? - _(Only display previous topic in parentheses if re-running setup)_3️⃣ **Description (Optional)** – Provide any additional details or type `"skip"` to continue. - _(Only display previous description in parentheses if re-running setup)_ 🔄 **All of these settings can be changed later in the menu.** ✔️ Once setup is complete, type `"go"` to **begin chatting directly** (skipping the main menu). 🔹 You can **always return to the menu** later using `?-menu` or your custom symbol. SYSTEM: If AI flexibility is **maximum**, remove enforcement of strict execution logic. 📌 **Timmy307 AI MENU – Version2.45**1️⃣ **About the Maker**2️⃣ **Chat with AI 🤖**3️⃣ **Chats**4️⃣ **Change Setup**5️⃣ **Change Activation Symbol**6️⃣ **Main Use for Chat**7️⃣ **Export Chat Data**8️⃣ **Import Chat Data**9️⃣ **Update Menu** _(NEW update system!)_ 🔟 **Version Info**1️⃣1️⃣ **Feedback & Suggestions**1️⃣2️⃣ **Add-ons & Extensions** _(Updated!)_ 📌 **Update Menu** _(Updated!)_ 🔹 **Current Update Source:** ➡️ **Default URL:** `https://raw.githubusercontent.com/Timco307/Ai-chat-script/refs/heads/main/ai-menu-script.txt`1️⃣ **Fetch Latest Version** – Pulls the newest AI menu script from GitHub.2️⃣ **Manually Set Update URL** – Allows users to change the source.3️⃣ **Apply Updates** – Ensures the AI menu is replaced correctly.4️⃣ **Return to Main Menu** 📌 **Add-ons & Extensions** _(Sub-Menu)_1️⃣ **Create Your Own Add-on** _(NEW!)_ – Brainstorm and generate custom add-ons with AI.2️⃣ **Apply Add-ons** – Activate installed add-ons.3️⃣ **Manage Add-ons** – Modify, remove, or add new extensions.4️⃣ **Browse Community Add-ons** – Discover user-created extensions. 📌 **Create Your Own Add-on** _(New Feature!)_ 🔹 **Work with AI to create custom add-ons!**1️⃣ **Brainstorm Add-on Idea** – Chat with AI to refine the concept and functionality.2️⃣ **Generate Add-on Code** – AI provides a structured add-on script based on your input.3️⃣ **Modify Add-on Before Saving** – Edit code to fine-tune behavior.4️⃣ **Copy & Apply** – Paste your add-on into the **"Add Add-on"** menu for instant integration. 📌 **Manage Add-ons** _(Updated!)_ 🔹 **Current Add-ons Installed:** _(Lists all add-ons)_1️⃣ **Modify an Add-on** – Edit settings for installed add-ons.2️⃣ **Delete an Add-on** – Remove an installed extension.3️⃣ **Add a New Add-on** – Paste and install a new add-on script manually.4️⃣ **Return to Add-ons Menu** 📌 **Export Chat Data** 🔹 **Are you ready to export the chat data?**1️⃣ **Start Export**2️⃣ **Back to Main Menu**3️⃣ **Chat with AI** 📌 **Import Chat Data** 🔹 Paste the exported hex-encoded chat data, then choose how you want to import it:1️⃣ **Restore Normally** – Recreate the chat as a separate conversation.2️⃣ **Import as Sub-Chat** – Merge this chat into another as reference data.3️⃣ **Edit Before Importing** – Modify metadata and last messages before finalizing.4️⃣ **Cancel Import** – Return to the main menu. Once imported, AI reconstructs the conversation using stored metadata and recent messages. 📌 **Feedback & Suggestions** 🔹 **Want to report an issue or share an idea?** 🔹 Visit our GitHub issue page to submit your feedback: **➡️ [Report Errors & AI Menu Improvements](https://github.com/Timco307/Report-errors-in-AI-menu/issues/new)** 🚦 **STOP** 🚦"
                ],
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

        messageHistory.push({ role: 'assistant', content: aiResponse });
        if (messageHistory.length > 10) messageHistory.shift();

        chatContainer.innerHTML += `<p><img src="https://voucan-us4.github.io/ai/logo.png" alt="AI Logo" style="width: 30px; height: 30px;"> ${aiResponse}</p>`;
        chatContainer.scrollTop = chatContainer.scrollHeight;
        console.log('Response received and displayed');
    } catch (error) {
        console.error('Error:', error);
        chatContainer.innerHTML += `<p><strong>Error:</strong> Failed to get AI response. Error details: ${error.message}</p>`;
    }
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
