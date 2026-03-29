const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
    });

    const response = completion.choices[0].message.content;
    res.json({ response });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/fix', async (req, res) => {
  const { code, language, error } = req.body;

  try {
    const prompt = `Fix this ${language} code that has the following error:\n\nError:\n${error}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\nReturn ONLY the fixed code, no explanation, no markdown backticks.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
    });

    const fixedCode = completion.choices[0].message.content;
    res.json({ fixedCode });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;