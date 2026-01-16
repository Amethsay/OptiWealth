const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const xlsx = require('xlsx');
const mammoth = require('mammoth');

dotenv.config();

// --- Basic Setup ---
const app = express();
const port = 3001; // Backend will run on a different port
app.use(cors()); // Allow frontend to talk to this server
app.use(express.json());

// --- Gemini AI Setup ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- File Upload Setup ---
const storage = multer.memoryStorage(); // Store files in memory for processing
const upload = multer({ storage });

// --- API Endpoints ---

// 1. CHAT ENDPOINT
app.post('/api/chat', async (req, res) => {
    const { history, message } = req.body;
    
    try {
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(message);
        const response = result.response;
        res.json({ message: response.text() });
    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({ error: "Failed to get response from AI." });
    }
});

// 2. FILE UPLOAD & ANALYSIS ENDPOINT
app.post('/api/upload', upload.single('statement'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        let textContent = '';
        // Parse based on file type
        if (req.file.mimetype === 'application/pdf') {
            const data = await pdfParse(req.file.buffer);
            textContent = data.text;
        } else if (req.file.mimetype.includes('spreadsheetml') || req.file.mimetype.includes('excel')) {
            const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            textContent = xlsx.utils.sheet_to_csv(worksheet);
        } else if (req.file.mimetype.includes('wordprocessingml')) {
             const result = await mammoth.extractRawText({ buffer: req.file.buffer });
             textContent = result.value;
        } else {
            return res.status(400).json({ error: 'Unsupported file type.' });
        }
        
        // Now, send the extracted text to Gemini for analysis
        const prompt = `
            Act as a meticulous accountant. Extract all transactions from the following text.
            Your response MUST be a valid JSON array of objects.
            Each object should have these exact keys: "date", "description", "amount".
            If a value is missing, use "N/A".
            Do not include any explanation or intro text, only the JSON.

            Text to analyze:
            ---
            ${textContent.substring(0, 10000)}
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        
        // Clean the response to ensure it's valid JSON
        let jsonResponse = response.text().trim();
        jsonResponse = jsonResponse.replace(/```json/g, '').replace(/```/g, '');

        res.send(jsonResponse); // Send the string directly

    } catch (error) {
        console.error("File Upload Error:", error);
        res.status(500).json({ error: "Failed to process file." });
    }
});


// --- Start Server ---
app.listen(port, () => {
    console.log(`FinGuide AI backend is running on http://localhost:${port}`);
    console.log('Ensure you have your GEMINI_API_KEY set in the .env file.');
});
