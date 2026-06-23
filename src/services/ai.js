import { AI_CONFIG } from '../config/api';

export const analyzeEvent = async (input, type = 'text') => {
  // TODO: Replace with actual AI API call using AI_CONFIG
  console.log(`[AI LOG] Analyzing ${type} input:`, input);
  
  // Simulated AI Logic for Demo Purposes
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('water') || lowerInput.includes('pipe') || lowerInput.includes('leak')) {
    return {
      type: 'Water Leak',
      severity: 'High',
      confidence: 0.94,
      topPriority: 'Turn off the main water supply to prevent further damage.',
      nextAction: 'Move valuables away from the affected area.',
      estimatedTime: '45 minutes',
      progress: 15
    };
  } else if (lowerInput.includes('car') || lowerInput.includes('accident') || lowerInput.includes('crash')) {
    return {
      type: 'Vehicle Accident',
      severity: 'Critical',
      confidence: 0.98,
      topPriority: 'Ensure everyone is safe and move to the side of the road if possible.',
      nextAction: 'Call emergency services if there are injuries.',
      estimatedTime: '2 hours',
      progress: 10
    };
  } else if (lowerInput.includes('card') || lowerInput.includes('fraud') || lowerInput.includes('charge')) {
    return {
      type: 'Fraudulent Charge',
      severity: 'Medium',
      confidence: 0.89,
      topPriority: 'Freeze your card immediately.',
      nextAction: 'Review recent transactions for other unauthorized charges.',
      estimatedTime: '15 minutes',
      progress: 40
    };
  }

  return { type: 'Unknown Event', severity: 'Low', confidence: 0.5 };
};