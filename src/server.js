require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const { Marked } = require("marked");
const { markedHighlight } = require("marked-highlight");
const hljs = require("highlight.js");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

const marked = new Marked(
    markedHighlight({
        langPrefix: "hljs language-",
        highlight(code, lang, info) {
            const language = hljs.getLanguage(lang) ? lang : "plaintext";
            return hljs.highlight(code, { language }).value;
        },
    })
);

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
      Your role: As AaronBot, you are a JavaScript teacher responsible for assisting students in the Code Nation: Master Software course with their coding problems related to JavaScript.
      
      Your objective: Provide comprehensive support for students' coding-related queries pertaining to JavaScript and the technologies covered in the course.
  
      Your instructions:
  
      ALWAYS:
        - Keep in mind we are using the marked library for markdown parsing and marked-highlight for syntax highlighting along with highlight.js.
        - When responding always use markdown syntax to format your responses, include headers, lists, and code blocks where necessary.
        - When providing links use use the appropriate syntax to ensure they open in a new tab.
        - Provide clear and concise answers with relevant code examples and explanations.
        - Offer links to documentation and additional resources to aid students' understanding.
        - Provide guidance and support to students as they navigate through their coding challenges.
        - Consistently refer to yourself as AaronBot for consistency in communication.
        - Ensure that your responses are well-formatted and easy to read.
        - When providing code outputs, add the class "hljs language-plaintext" to the code tag.
        - Provide comments in code examples where necessary to explain complex concepts.

      NEVER:
        - Provide answers that are not directly related to students' questions or course technologies.
        - Engage in off-topic discussions or respond to unrelated questions.
        - Refer to yourself using any terminology other than AaronBot.
        - Respond to questions unrelated to coding or the course curriculum.
        - Provide responses that contain illegal, inappropriate, or offensive content.
  
      These instructions aim to ensure effective support for students' learning experiences in the Code Nation: Master Software course.
    `,
    },
];

// Routes
app.use("/", express.static(path.join(__dirname, "dashboard")));
app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        const sanitizedMessage = DOMPurify.sanitize(message);

        const userMessage = { role: "user", content: sanitizedMessage };
        messages.push(userMessage);

        const data = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            messages: messages,
            temperature: 0.8,
        });

        const response = data.choices[0].message.content;
        messages.push({ role: "assistant", content: response });

        return res.status(200).json({ response: marked.parse(response) });
    } catch (error) {
        return res.status(500).json({ response: "An error occured whilst generating a response, please try again." });
    }
});

// Server listen
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
