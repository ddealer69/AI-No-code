import { UseCase, AIUseCase, RealUseCase } from '../types';

export const DOMAIN_DATA = {
  'Service Design & Development': {
    'Market Research': ['Research Planning', 'Data Collection', 'Analysis & Insights'],
    'Product Design': ['Concept Development', 'Prototyping', 'Testing & Validation'],
    'Service Innovation': ['Ideation', 'Development', 'Implementation']
  },
  'Operations & Manufacturing': {
    'Supply Chain': ['Planning', 'Procurement', 'Distribution'],
    'Quality Control': ['Monitoring', 'Testing', 'Compliance'],
    'Production Planning': ['Scheduling', 'Resource Allocation', 'Optimization']
  },
  'Customer Experience': {
    'Customer Support': ['Query Resolution', 'Technical Support', 'Feedback Management'],
    'Sales & Marketing': ['Lead Generation', 'Customer Acquisition', 'Retention'],
    'Digital Engagement': ['Online Experience', 'Personalization', 'Analytics']
  }
};

export const MATCHED_USE_CASES: UseCase[] = [
  {
    id: '1',
    businessProcess: 'Service Design & Development',
    functionalAreas: ['Market Research', 'Customer Insights'],
    jobRole: 'Chief Market Research Officer',
    primaryMetric: 'Finance',
    secondaryMetric: 'Time',
    aiUseCase: 'NLP for extracting insights from customer reviews',
    impact: '✅ Faster go-to-market, better product-market fit',
    expectedROI: '40-50% faster market entry'
  },
  {
    id: '2',
    businessProcess: 'Operations & Manufacturing',
    functionalAreas: ['Supply Chain', 'Demand Planning'],
    jobRole: 'Supply Chain Director',
    primaryMetric: 'Quality',
    secondaryMetric: 'Finance',
    aiUseCase: 'ML-based demand forecasting',
    impact: '✅ Reduced inventory costs, minimized stockouts',
    expectedROI: '15-20% cost reduction'
  },
  {
    id: '3',
    businessProcess: 'Customer Experience',
    functionalAreas: ['Customer Support', 'Service Quality'],
    jobRole: 'Customer Experience Manager',
    primaryMetric: 'Time',
    secondaryMetric: 'Quality',
    aiUseCase: 'Automated customer query classification',
    impact: '✅ Faster response times, improved satisfaction',
    expectedROI: '30% reduction in response time'
  }
];

export const AI_USE_CASES: AIUseCase[] = [
  {
    id: '1',
    useCase: 'NLP for extracting insights from customer reviews',
    aiSystemType: 'NLP',
    tools: ['Hugging Face', 'spaCy', 'NLTK', 'GPT-4', 'Google Cloud NLP'],
    customDev: true,
    implementationNotes: 'Requires text preprocessing pipelines, sentiment analysis models, and CRM integration for actionable insights.'
  },
  {
    id: '2',
    useCase: 'ML-based demand forecasting',
    aiSystemType: 'Predictive Analysis',
    tools: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Azure ML', 'AWS SageMaker'],
    customDev: true,
    implementationNotes: 'Needs historical sales data, external market indicators, and real-time inventory management system integration.'
  },
  {
    id: '3',
    useCase: 'Automated customer query classification',
    aiSystemType: 'ML',
    tools: ['BERT', 'FastText', 'Azure Cognitive Services', 'Dialogflow'],
    customDev: false,
    implementationNotes: 'Can leverage pre-trained models with domain-specific fine-tuning. Requires integration with ticketing systems.'
  }
];

export const REAL_USE_CASES: RealUseCase[] = [
  {
    id: '1',
    businessProcess: 'Service Design & Development',
    function: 'Market Research',
    outcome: 'Faster go-to-market, ROI 40-50%',
    company: 'Procter & Gamble',
    project1: 'Used ML forecasting to optimize global supply chain operations, reducing inventory costs by 18%',
    project2: 'Implemented NLP analysis of customer feedback across 50+ markets to identify emerging consumer trends'
  },
  {
    id: '2',
    businessProcess: 'Service Design & Development',
    function: 'Market Research',
    outcome: 'Faster product innovation, better market alignment',
    company: 'Godrej Appliances',
    project1: 'AI-powered aggregation and analysis of customer reviews identified 3 major unmet needs in kitchen appliances',
    project2: 'Reduced time-to-market for new product features by 35% through predictive trend analysis'
  },
  {
    id: '3',
    businessProcess: 'Operations & Manufacturing',
    function: 'Supply Chain',
    outcome: 'Cost reduction, improved efficiency',
    company: 'Unilever',
    project1: 'Deployed machine learning for demand forecasting across 190 countries, reducing stockouts by 25%',
    project2: 'Optimized transportation routes using AI, achieving 12% reduction in logistics costs'
  }
];