import { PricingConfig } from './types';

export const PRICING: PricingConfig = {
  fiverr: {
    simple: { min: 4150, base: 8300 },
    moderate: { min: 16600, base: 24900 },
    complex: { min: 33200, base: 49800 },
    enterprise: { min: 107900, base: 166000 }
  },
  upwork: {
    simple: { min: 12450, base: 24900 },
    moderate: { min: 41500, base: 66400 },
    complex: { min: 82800, base: 124500 },
    enterprise: { min: 248000, base: 414000 }
  },
  india: {
    simple: { min: 16600, base: 49800 },
    moderate: { min: 66400, base: 124500 },
    complex: { min: 124500, base: 298800 },
    enterprise: { min: 298800, base: 831000 }
  }
};

export const INITIAL_WORKFLOW = {
    id: 1,
    nodes: 15,
    integrations: 2,
    logic: 5,
    isExpanded: true
};
