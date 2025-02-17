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
            max_tokens: 300, // Increase for more detailed responses
            messages: [
                { role: "system", content: "You are an expert leadership coach. Your job is to analyze leadership traits based on user responses and provide deep, actionable insights that inspire growth." },
                { 
                    role: "user", 
                    content: `Analyze the following leadership responses: ${JSON.stringify(req.body)}.
                    
                    1. **Summarize** what type of leader this person might be in a compelling, emotionally engaging way.
                    2. **Identify three blind spots** this leader might have, and suggest **specific** ways they can work on them.
                    3. **Provide one high-impact leadership development tip** based on their responses.
                    
                    Ensure your response is motivational, constructive, and directly relevant to their input.` 
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