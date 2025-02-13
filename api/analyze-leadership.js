import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this is correctly set in Vercel
});

export default async function handler(req, res) {
    console.log("API Request Received:", req.body);

    // ✅ Ensure only POST requests are allowed
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    // ✅ Ensure request contains data
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No data received" });
    }

    try {
        console.log("Calling OpenAI API...");

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            max_tokens: 200, // Limits output length for faster responses
            messages: [
                { role: "system", content: "Analyze leadership traits and provide improvement recommendations." },
                { role: "user", content: `User responses: ${JSON.stringify(req.body)}. Provide a leadership analysis with strengths, weaknesses, and an improvement roadmap.` }
            ],
        });

        console.log("OpenAI Response:", response);

        if (!response.choices || response.choices.length === 0) {
            throw new Error("No valid response from OpenAI");
        }

        res.status(200).json({ analysis: response.choices[0].message.content });

    } catch (error) {
        console.error("OpenAI API Error:", error);

        res.status(500).json({
            error: "AI Analysis Failed",
            details: error.message,
            fallback: "We encountered an issue processing your request. Try again later."
        });
    }
}
