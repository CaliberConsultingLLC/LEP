const response = await openai.chat.completions.create({
    model: "gpt-4",
    max_tokens: 200, // Reduce output length to prevent long response times
    messages: [
        { role: "system", content: "Analyze leadership traits based on user input and provide improvement recommendations." },
        { role: "user", content: `User responses: ${JSON.stringify(req.body)}. Based on this data, analyze strengths, weaknesses, and provide a leadership development roadmap.` }
    ],
});
