import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in Vercel
});

const formality = req.body.feedbackFormality || 5; // default to 5 if missing
const tone = req.body.feedbackTone || 5;

const personaInstruction = `
The user wants feedback that is at a formality level of ${formality} 
(on a scale of 1-10, 1=Very Informal, 10=Very Formal)
and a tone level of ${tone}
(on a scale of 1-10, 1=Very Harsh, 10=Very Empathetic).
`;

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
            model: "gpt-3.5-turbo",
            max_tokens: 200, // Increase for more detailed responses
            messages: [
                { role: "system", content: "You are acting as an seasoned leadership coach. Your job is to analyze leadership traits based on user responses and provide comedic, raw insights and improvement actions for this leader." },
                { 
                    role: "user", 
                    content: `${personaInstruction} Analyze the following leadership responses: ${JSON.stringify(req.body)}.
                    
                    1. Characterize this leader in 1 sentence in an out-of-the-box fashion.
                    2. Identify 2 blind spots this leader might have in the general format of "This probably looks like...".
                    3. Provide one leadership development tip based on their responses. Feel free to be candid and/or use profanity.
                    
                    Ensure your response is candid, comedic, and still relevant to their input.` 
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