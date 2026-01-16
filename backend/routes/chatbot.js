// backend/routes/chatbot.js
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
// const auth = require("../middleware/authMiddleware");

// router.use(auth);

function toHfMessages(frontendMessages) {
  return frontendMessages.map(m => ({
    role: m.sender === "user" ? "user" : "assistant",
    content: m.text
  }));
}

function ensureAlternatingRoles(hfMessages) {
  const maxTurns = 8;
  let msgs = hfMessages.slice(-maxTurns);
  if (msgs.length === 0 || msgs[0].role !== "user") {
    msgs.unshift({ role: "user", content: "Start the conversation." });
  }
  const fixed = [];
  for (const m of msgs) {
    if (fixed.length === 0 || fixed[fixed.length - 1].role !== m.role) {
      fixed.push(m);
    } else {
      fixed[fixed.length - 1].content += "\n" + m.content;
    }
  }
  return fixed;
}

function buildSystemPrompt() {
  return `You are an AI prompt assistant for poster generation.
When the user asks for a prompt or describes a product, respond with a concise, vivid prompt suitable for image generation.
Focus on visual style, lighting, composition, and mood.
Keep it under 20 words unless the user asks for detail.
Do not add explanations or meta commentary—just the prompt.`;
}

router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.sender !== "user") {
      return res.status(400).json({ error: "User message required" });
    }

    // Check if it's a valid poster request using ML model
    try {
      const mlPort = process.env.ML_PORT || 5001;
      const mlResponse = await fetch(`http://localhost:${mlPort}/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompts: [lastMessage.text] })
      });

      if (mlResponse.ok) {
        const mlResult = await mlResponse.json();
        const score = mlResult.scores[0];
        console.log(`ML Score for "${lastMessage.text}": ${score}`);
        
        // If score is below threshold (0.3), it's not a poster request
        if (score < 0.3) {
          return res.json({ 
            reply: "Not a request for a visual poster. I am an AI *poster* prompt assistant." 
          });
        }
      }
    } catch (mlError) {
      console.error("ML scoring failed, proceeding without validation:", mlError.message);
    }

    const hfMessagesRaw = toHfMessages(messages);
    const hfMessages = ensureAlternatingRoles(hfMessagesRaw);
    hfMessages.unshift({ role: "system", content: buildSystemPrompt() });

    const response = await fetch(`${process.env.HF_API_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.HF_MODEL,
        messages: hfMessages,
        max_tokens: 400,
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!data?.choices?.length) {
      console.log("Gemma error:", data);
      return res.json({ reply: "I couldn't generate a response." });
    }

    const reply = data.choices[0].message?.content ?? data.choices[0].message ?? "No reply";
    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "Chatbot failed" });
  }
});

module.exports = router;