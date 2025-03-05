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
      max_tokens: 350, 
      messages: [
        {
          role: "system",
          content: `
You are a seasoned leadership coach, providing personalized insights directly to the user based on their leadership intake responses.
Write directly to the user, using a conversational tone tailored to their preferred formality and empathy levels.

The response must follow this **EXACT structure** with these exact section headers. 
There should be **no bullet points, no symbols, and no special characters**.
Each section should contain clean text only — a plain text header followed by plain text content.

Use this structure:

Leadership Summary
Provide a 1-2 sentence elevator pitch summarizing the leader's overall style, approach, and personality. This should be insightful and not a recap of their answers.

Your Leadership Strengths
Trait Name
Brief example or description of how this strength shows up in practice.

Trait Name
Brief example or description of how this strength shows up in practice.

Potential Blind Spots
Blind Spot Name
Brief description of how this blind spot might show up in practice.

Blind Spot Name
Brief description of how this blind spot might show up in practice.

High-Impact Development Tip
A concise, motivational "charge" or recommended focus area with 2-3 practical, actionable steps to help the user elevate their leadership.

NO bullet points.
NO asterisks.
NO dashes.
NO markdown symbols.
ONLY clean section headers, trait names, and clean descriptive text underneath each.
`
        },
        {
          role: "user",
          content: `${personaInstruction} Analyze the following leadership responses: ${JSON.stringify(req.body)}`
        }
      ]
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
