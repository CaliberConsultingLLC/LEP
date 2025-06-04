import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { analysis } = req.body;

    if (!analysis) {
        return res.status(400).json({ error: "Missing analysis data" });
    }

    try {
        const aiPrompt = `
        You are an expert leadership coach and organizational psychologist. Your task is to generate a personalized leadership continuous improvement campaign for the leader based on the following leadership analysis:

        ${analysis}

        First, select 5 core leadership traits that the leader should focus on improving.

        For each selected trait, create 3 team-facing survey statements. Each statement should describe a clear, observable behavior associated with that trait — something the team would be able to observe and rate.

        These statements will be rated by the team using a dual-axis 9-box grid (one axis for how well the leader demonstrates the behavior, one for how much the leader focuses on improving it).

        Output the results in this format — no bullets, no special characters, just clean text:

        Trait: [Trait Name]
        1. [Survey statement 1]
        2. [Survey statement 2]
        3. [Survey statement 3]

        Do this for all 5 traits. Keep your language professional and clear.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            max_tokens: 1000,
            messages: [
                { role: "system", content: "You are a highly skilled leadership development advisor." },
                { role: "user", content: aiPrompt }
            ]
        });

        const campaignText = response.choices[0].message.content.trim();
        const campaign = parseCampaignText(campaignText);

        res.status(200).json({ campaign });

    } catch (error) {
        console.error("Error generating campaign:", error);
        res.status(500).json({ error: "Failed to generate campaign", details: error.message });
    }
}

function parseCampaignText(text) {
    const lines = text.split("\n").map(line => line.trim()).filter(line => line);

    const traits = [];
    let currentTrait = null;

    lines.forEach(line => {
        if (line.startsWith("Trait:")) {
            if (currentTrait) {
                traits.push(currentTrait);
            }
            currentTrait = { trait: line.replace("Trait:", "").trim(), statements: [] };
        } else if (currentTrait && line.match(/^\d+\./)) {
            currentTrait.statements.push(line.replace(/^\d+\.\s*/, "").trim());
        }
    });

    if (currentTrait) {
        traits.push(currentTrait);
    }

    return traits;
}
