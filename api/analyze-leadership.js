import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in Vercel
});

export default async function handler(req, res) { // Make sure req and res are passed
    console.log("Received Request:", req.body);

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No data received" });
    }

    try {
        console.log("Calling OpenAI API...");

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            max_tokens: 300, // Enough for a short summary + bullet points
            messages: [
                { role: "system", content: "Analyze leadership traits and provide insights." },
                { 
                    role: "user", 
                    content: `Based on these user responses: ${JSON.stringify(req.body)},
                    share an insightful, direct summary of what type of leader I am **two short sentences**.
                    Then, list **three potential improvement areas**, formatted as bullet points.` 
                }
            ],
        });

        console.log("OpenAI Response:", response);
        res.status(200).json({ analysis: response.choices[0].message.content.trim() });

    } catch (error) {
        console.error("OpenAI API Error:", error);
        res.status(500).json({ error: "AI Analysis Failed", details: error.message });
    }
}