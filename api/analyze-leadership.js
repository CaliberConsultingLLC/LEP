import OpenAI from "openai";

export default async function handler(req, res) {
    console.log("Received Request:", req.body);

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No data received" });
    }

    const { leadershipJourney, leadershipConfidence, leadershipChallenges, leadershipReflection, leadershipPriorities } = req.body;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "Analyze leadership traits based on user input and provide improvement recommendations." },
                { role: "user", content: `User provided the following responses: ${JSON.stringify(req.body)}. Based on this data, analyze the leadership strengths and areas for improvement, then provide a short leadership development roadmap.` }
            ],
        });

        const aiAnalysis = response.choices[0].message.content;

        res.status(200).json({ analysis: aiAnalysis });
    } catch (error) {
        console.error("OpenAI API Error:", error);
        res.status(500).json({ error: "AI Analysis Failed", details: error.message });
    }
}