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
Format the output with clear section headers and bullet points. Avoid symbols like '**' or '[description]'.
Example:
Leadership Summary
- You excel at...
- Your team likely appreciates...

Potential Blind Spots
- You may struggle with...
- When faced with conflict...

High-Impact Development Tip
- Consider focusing on...

Use this format and style exactly.
          `,
        },
        {
          role: "user",
          content: `${personaInstruction} Analyze the following leadership responses: ${JSON.stringify(req.body)}.

Characterize this leader (Leadership Summary)
Identify 2 leadership traits they are likely skilled in, with a brief description
Identify 3 likely blind spots, with brief descriptions
Provide one high-impact leadership development tip
          `,
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
