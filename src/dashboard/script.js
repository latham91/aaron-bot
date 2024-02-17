// Select elements
const chatInput = document.querySelector(".chat-input");
const sendButton = document.querySelector(".send-button");
const main = document.querySelector("main");
const form = document.querySelector("form");
const loading = document.querySelector(".loading");

// Create user message
const createUserMessage = (message) => {
    const chatBubble = createChatBubble("User", message);
    main.appendChild(chatBubble);
};

// Create bot message
const createBotMessage = (message) => {
    const chatBubble = createChatBubble("Aaron Bot", message);
    main.appendChild(chatBubble);
};

// Create chat bubble
const createChatBubble = (role, message) => {
    const chatBubble = document.createElement("div");
    chatBubble.classList.add("chat-bubble");

    const roleContainer = document.createElement("div");
    roleContainer.classList.add("role-container");

    const avatar = document.createElement("img");
    avatar.src = role === "User" ? "./user.png" : "./avatar.png";
    avatar.alt = "avatar";
    avatar.width = 50;

    const h2 = document.createElement("h2");
    h2.textContent = role;

    roleContainer.appendChild(avatar);
    roleContainer.appendChild(h2);

    const messageDiv = document.createElement("div");
    messageDiv.classList.add(role === "User" ? "message" : "message-bot");
    messageDiv.innerHTML = message;

    chatBubble.appendChild(roleContainer);
    chatBubble.appendChild(messageDiv);

    return chatBubble;
};

// Submit form event listener
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = chatInput.value;
    createUserMessage(message);
    chatInput.value = "";

    loading.classList.remove("hidden");

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch response");
        }

        const data = await response.json();
        createBotMessage(data.response);
    } catch (error) {
        console.error("Error:", error.message);
        // Handle error
    } finally {
        loading.classList.add("hidden");
        // Scroll to the bottom of the chat
        main.scrollTop = main.scrollHeight;
    }
});
