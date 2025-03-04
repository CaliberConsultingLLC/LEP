import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  console.log("Received Request:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "No data received" });
  }

  const formality = req.body.feedbackFormality || 5;
  const tone = req.body.feedbackTone || 5;

  const personaInstruction = `
The user wants feedback at a formality level of ${formality} 
(on a scale of 1-10, 1=Very Informal, 10=Very Formal)
and a tone level of ${tone} 
(on a scale of 1-10, 1=Very Harsh, 10=Very Empathetic).
`;

  try {
    console.log("Calling OpenAI API...");

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: `
You are a seasoned leadership coach. Analyze the user's responses to uncover strengths, blind spots, and areas for improvement.
Write directly to the user in a conversational tone, tailored to their preferred formality and empathy level.
Use the following section titles in your response, and use bullet points for lists:

Leadership Summary
- [Summary points about the user]

Leadership Traits
- [Trait 1 description]
- [Trait 2 description]

Potential Blind Spots
- [Blind Spot 1 description]
- [Blind Spot 2 description]
- [Blind Spot 3 description]

High-Impact Development Tip
- [One key tip to focus on]
          `,
        },
        {
          role: "user",
          content: `${personaInstruction} Analyze the following leadership responses: ${JSON.stringify(req.body)}`,
        },
      ],
    });

    console.log("OpenAI Response:", response);

    res.status(200).json({
      analysis: response.choices[0].message.content.trim()
    });

  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "AI Analysis Failed", details: error.message });
  }
}
