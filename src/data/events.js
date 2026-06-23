import { Car, CreditCard, Droplet, HelpCircle } from 'lucide-react';

export const getEventTemplate = (type) => {
  const templates = {
    water: {
      type: 'Water Leak',
      severity: 'High',
      estimatedTime: '45 minutes',
      icon: Droplet,
      actionQueue: [
        "Ensure the area is physically safe to enter without slipping or shock risk.",
        "Turn off the main water supply valve to stop the flow.",
        "Safely unplug any electronics near the water.",
        "Move valuable items to a dry area."
      ],
      helpLinks: ['Find emergency plumber', 'Water mitigation crew'],
      checklist: [
        { id: 1, text: 'Safety secured', done: false },
        { id: 2, text: 'Main water supply shut off', done: false },
        { id: 3, text: 'Electronics unplugged', done: false },
        { id: 4, text: 'Valuables moved', done: false }
      ]
    },
    accident: {
      type: 'Vehicle Accident',
      severity: 'Critical',
      estimatedTime: '2 hours',
      icon: Car,
      actionQueue: [
        "Ensure everyone is safe and move to the side of the road if possible.",
        "Turn on your hazard lights.",
        "Take 3-4 wide photos of the scene while it's fresh.",
        "Exchange information with other drivers."
      ],
      helpLinks: ['Request Roadside Assistance', 'Call emergency services'],
      checklist: [
        { id: 1, text: 'Vehicles moved to safety', done: false },
        { id: 2, text: 'Hazard lights activated', done: false },
        { id: 3, text: 'Photos captured', done: false },
        { id: 4, text: 'Exchange information', done: false }
      ]
    },
    fraud: {
      type: 'Fraudulent Charge',
      severity: 'Medium',
      estimatedTime: '15 minutes',
      icon: CreditCard,
      actionQueue: [
        "Verify your identity to secure the session.",
        "Freeze your digital wallet and primary card.",
        "Review your ledger for other unauthorized charges.",
        "Flag the specific disputed charge for investigation."
      ],
      helpLinks: ['Connect to Fraud Specialist', 'Issue temporary virtual card'],
      checklist: [
        { id: 1, text: 'Identity verified', done: false },
        { id: 2, text: 'Primary account frozen', done: false },
        { id: 3, text: 'Ledger reviewed', done: false },
        { id: 4, text: 'Disputed charge flagged', done: false }
      ]
    },
    unknown: {
      type: 'Analyzing Event',
      severity: 'Unknown',
      estimatedTime: 'Pending Assessment',
      icon: HelpCircle,
      actionQueue: [
        "Please ensure you are in a safe location.",
        "We are connecting your context to a specialist."
      ],
      helpLinks: ['Call Emergency Hotline'],
      checklist: [
        { id: 1, text: 'Personal safety verified', done: false },
        { id: 2, text: 'Specialist connected', done: false }
      ]
    }
  };

  const template = templates[type] || templates['unknown'];

  return {
    ...template,
    actionQueue: [...template.actionQueue],
    helpLinks: [...template.helpLinks],
    checklist: template.checklist.map(item => ({ ...item }))
  };
};