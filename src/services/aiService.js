// src/services/aiService.js
import { getEventTemplate } from '../data/events';

const AI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export const analyzeIncident = async (text, file = null) => {
  const apiKey = import.meta.env.VITE_ENTERPRISE_AI_KEY;

  if (!apiKey) {
    console.warn('[AI Edge] No API key detected. Running local heuristic model.');
    const val = (text || '').toLowerCase();
    const fileName = file ? file.name.toLowerCase() : '';
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Dynamic resolution based strictly on input context
    if (val.includes('accident') || val.includes('car') || fileName.includes('car') || fileName.includes('crash')) return getEventTemplate('accident');
    if (val.includes('card') || val.includes('fraud') || val.includes('charge') || fileName.includes('statement')) return getEventTemplate('fraud');
    if (val.includes('water') || val.includes('leak') || val.includes('pipe') || fileName.includes('water')) return getEventTemplate('water');
    
    // Default Unknown State if no keywords match
    return getEventTemplate('unknown');
  }

  try {
    console.log('[AI Edge] Transmitting context to Enterprise LLM...');
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: "system",
            content: "You are an Allstate triage AI. Map the user's crisis to one of three categories: 'water', 'accident', or 'fraud'. Respond with ONLY that single word. If unclear, respond 'unknown'."
          },
          { role: "user", content: text || "Image uploaded." }
        ],
        temperature: 0.1
      })
    });

    if (!response.ok) throw new Error('AI API responded with an error');

    const data = await response.json();
    const intent = data.choices[0].message.content.trim().toLowerCase();
    
    return getEventTemplate(intent);

  } catch (error) {
    console.error('[AI Edge] Enterprise AI call failed. Falling back to unknown default.', error);
    return getEventTemplate('unknown');
  }
};