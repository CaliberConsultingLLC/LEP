import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in Vercel
});

export default async function handler(req, res) {
  // Now 'req' is defined

  console.log("Received Request:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "No data received" });
  }

  // Move them here so 'req' is in scope:
  const formality = req.body.feedbackFormality || 5;
  const tone = req.body.feedbackTone || 5;

  const personaInstruction = `
The user wants feedback that is at a formality level of ${formality}
(on a scale of 1-10, 1=Very Informal, 10=Very Formal)
and a tone level of ${tone}
(on a scale of 1-10, 1=Very Harsh, 10=Very Empathetic).
`;

  try {
    console.log("Calling OpenAI API...");

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content: "You are acting as a seasoned leadership coach..."
        },
        {
          role: "user",
          content: `${personaInstruction} Analyze the following leadership responses: ${JSON.stringify(req.body)}.

1. Characterize this leader in 1 sentence...
3. Identify 3 leadership traits that are likely skilled in...
2. Identify 5 leadership traits they likely struggle with...
3. Provide one leadership development tip...
`
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