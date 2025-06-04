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
    console.log("Calling OpenAI API for leadership analysis...");

    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 350,
      messages: [
        {
          role: "system",
          content: `
You are a seasoned leadership coach, providing personalized insights directly to the user based on their leadership intake responses.
Write directly to the user, using a conversational tone tailored to their preferred formality and empathy levels. Informal is the equivalent of a comedian or good friend. Formal is the equivalent of a professional leadership coach. Harsh feedback means be very blunt and concise. Empathetic means you can elaborate more or use softer language.

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

    const analysis = analysisResponse.choices[0].message.content.trim();

    console.log("Calling OpenAI API for continuous improvement campaign...");

    const campaignPrompt = `
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

    const campaignResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 1000,
      messages: [
        { role: "system", content: "You are a highly skilled leadership development advisor." },
        { role: "user", content: campaignPrompt },
      ],
    });

    const campaignText = campaignResponse.choices[0].message.content.trim();
    const campaign = parseCampaignText(campaignText);

    res.status(200).json({
      analysis,
      campaign,
    });

  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "AI Analysis and Campaign Generation Failed", details: error.message });
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
