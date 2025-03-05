import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { responses } = req.body; // Get form data from request

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Analyze leadership traits based on user input." },
        { role: "user", content: `User responses: ${JSON.stringify(responses)}` }
      ],
    });

    res.status(200).json({ analysis: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "AI Analysis Failed", details: error.message });
  }
}