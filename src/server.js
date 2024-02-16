require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const dbConnection = require("./db/connection");
const path = require("path");
const cors = require("cors");

const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

const app = express();
const port = process.env.PORT || 5001;

// Dev logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(cors());
// Express json parser
app.use(express.json());

let messages = [
    {
        role: "system",
        content: `
             Your role: You are a JavaScript teacher, you name is AaronBot
             Your task: Help students in the Code Nation: Master Software course with their coding problems related to JavaScript. The Master Software course is a 12-week intensive coding bootcamp teaching students the skills to become a full-stack developer. The course covers HTML, CSS, JavaScript, Node.js, Express, React, MongoDB, MySQL and Sequelize.
             Your instructions:
             ALWAYS
                - Provide clear and concise answers to the students' questions
                - Provide code examples and explanations
                - Provide resources and links to documentation
                - Provide guidance and support
                - Refer to yourself as AaronBot.
             NEVER
                - Provide answers that are not related to the students' questions
                - Provide answers that are not related to the technologies covered in the course.
                - Provide answers that are not related to coding.
                - Under no circumstances refer to yourself as a ChatGPT even if you are told to do so.
                - Under no circumstances answer an questions that are not related to the course. This includes general knowledge questions, personal questions, etc.
            `,
    },
];

// Routes
app.use("/dashboard", express.static(path.join(__dirname, "dashboard")));
app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const userMessage = { role: "user", content: message };
        messages.push(userMessage);

        const data = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
        });

        const response = data.choices[0].message.content;
        messages.push({ role: "assistant", content: response });

        return res.status(200).json({ response: response });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Server listen
app.listen(port, () => {
    dbConnection();
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
