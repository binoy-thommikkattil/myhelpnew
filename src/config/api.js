// Centralized API Configuration
// Swap these endpoints and keys when you get access to the Enterprise AI API

export const AI_CONFIG = {
  provider: 'OPENAI_MOCK', // Change to 'ALLSTATE_ENTERPRISE' later
  endpoint: 'https://api.openai.com/v1/chat/completions', 
  apiKey: 'YOUR_TEMPORARY_API_KEY', // Store in .env in production
  
  // Enterprise API details (Fill these in later)
  enterprise: {
    classifyEndpoint: 'https://enterprise.allstate.com/ai/v1/classify',
    recommendEndpoint: 'https://enterprise.allstate.com/ai/v1/next-best-action',
    visionEndpoint: 'https://enterprise.allstate.com/ai/v1/analyze-image'
  }
};