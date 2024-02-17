const chatInput = document.querySelector(".chat-input");
const sendButton = document.querySelector(".send-button");
const main = document.querySelector("main");
const form = document.querySelector("form");

const createUserMessage = (message) => {
    const chatBubble = document.createElement("div");
    chatBubble.classList.add("chat-bubble");

    const roleContainer = document.createElement("div");
    roleContainer.classList.add("role-container");

    const avatar = document.createElement("img");
    avatar.src = "./user.png";
    avatar.alt = "avatar";
    avatar.width = 50;

    const h2 = document.createElement("h2");
    h2.textContent = "User";

    roleContainer.appendChild(avatar);
    roleContainer.appendChild(h2);

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.textContent = message;

    chatBubble.appendChild(roleContainer);
    chatBubble.appendChild(messageDiv);

    main.appendChild(chatBubble);
};

const createBotMessage = (message) => {
    const chatBubble = document.createElement("div");
    chatBubble.classList.add("chat-bubble");

    const roleContainer = document.createElement("div");
    roleContainer.classList.add("role-container-bot");

    const avatar = document.createElement("img");
    avatar.classList.add("avatar-bot");
    avatar.src = "./avatar.png";
    avatar.alt = "avatar";
    avatar.width = 50;

    const h2 = document.createElement("h2");
    h2.textContent = "Aaron Bot";

    roleContainer.appendChild(h2);
    roleContainer.appendChild(avatar);

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message-bot");
    messageDiv.classList.add("prettyprint");
    messageDiv.innerHTML = message;

    chatBubble.appendChild(roleContainer);
    chatBubble.appendChild(messageDiv);

    main.appendChild(chatBubble);
};

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = chatInput.value;
    createUserMessage(message);
    chatInput.value = "";

    const response = await fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
    });

    const data = await response.json();
    // const reply = marked.parse(data.response);

    createBotMessage(data.response);
});
