import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in Vercel
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
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content: "You are a seasoned leadership coach. Your job is to analyze leadership responses and provide feedback in the user's preferred formality and empathy level. Please follow this exact format in your response, using clear section headers and bullet points."
        },
        {
          role: "user",
          content: `${personaInstruction} Analyze the following leadership responses: ${JSON.stringify(req.body)}.

1. Characterize this leader [Summary Line]
2. Identify 2 leadership traits they are likely skilled in, with a brief description:
- Leadership Trait 1: [description]
- Leadership Trait 2: [description]
3. Identify 3 likely blind spots, with brief descriptions:
- Blind Spot 1: [description]
- Blind Spot 2: [description]
- Blind Spot 3: [description]
4. Provide one high-impact leadership development tip:
- Tip: [description]
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
