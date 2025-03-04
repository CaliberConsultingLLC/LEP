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
You are a seasoned leadership coach, providing personalized insights directly to the user based on their leadership intake responses.
You will write directly to the user, using a conversational tone that reflects their preferred formality and empathy levels.
The response must follow this exact structure with these section titles:

Leadership Summary
A 1-2 sentence "elevator pitch" summarizing the leader's style, personality, and approach to leadership. This should be insightful, not a list of their answers.

Your Leadership Strengths
[Trait Name]
  Brief example or description of how this strength might show up in practice
  Another example (optional)
[Trait Name]
  Brief example or description of how this strength might show up in practice
  Another example (optional)

Potential Blind Spots
[Blind Spot Name]
  Brief description of how this might show up in practice
  Another example (optional)
[Blind Spot Name]
  Brief description of how this might show up in practice
  Another example (optional)
[Blind Spot Name]
  Brief description of how this might show up in practice
  Another example (optional)

High-Impact Development Tip
A concise, motivational "charge" or recommended focus area with practical, actionable steps they can take to level up their leadership.
This section should be inspiring but also realistic.

Use no more than 500 tokens.
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
