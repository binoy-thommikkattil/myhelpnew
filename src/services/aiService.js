import { getEventTemplate } from '../data/events';

/**
 * Enterprise AI Integration Point
 * * To switch to the real AI:
 * 1. Create a .env file in your root directory.
 * 2. Add: VITE_ENTERPRISE_AI_KEY=your_actual_api_key
 * 3. Update the endpoint URL below to match your enterprise provider (OpenAI, Anthropic, internal Allstate LLM, etc.)
 */
const AI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export const analyzeIncident = async (text, file = null) => {
  const apiKey = import.meta.env.VITE_ENTERPRISE_AI_KEY;

  // FALLBACK: If no API key is provided, use our deterministic local heuristic.
  // This ensures the app never crashes during a demo if network fails.
  if (!apiKey) {
    console.warn('[AI Edge] No API key detected. Running local heuristic model.');
    const val = (text || '').toLowerCase();
    
    // Simulate network delay for demo
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (val.includes('accident') || val.includes('car') || file) return getEventTemplate('accident');
    if (val.includes('card') || val.includes('fraud')) return getEventTemplate('fraud');
    return getEventTemplate('water');
  }

  // REAL AI IMPLEMENTATION
  try {
    console.log('[AI Edge] Transmitting context to Enterprise LLM...');
    
    // In a full production app with images, you would convert the 'file' to Base64 here
    // and append it to the messages array if your model supports Vision.
    
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4', // Swap with your enterprise model
        messages: [
          {
            role: "system",
            content: "You are an Allstate triage AI. Map the user's crisis to one of three categories: 'water', 'accident', or 'fraud'. Respond with ONLY that single word."
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
    console.error('[AI Edge] Enterprise AI call failed. Falling back to safe defaults.', error);
    return getEventTemplate('unknown');
  }
};