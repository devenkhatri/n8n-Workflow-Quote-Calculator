export type PlatformType = 'fiverr' | 'upwork' | 'india';

export interface Workflow {
  id: number;
  nodes: number;
  integrations: number;
  logic: number;
  isExpanded: boolean;
}

export interface PricingTier {
  min: number;
  base: number;
}

export interface PlatformPricing {
  simple: PricingTier;
  moderate: PricingTier;
  complex: PricingTier;
  enterprise: PricingTier;
}

export interface PricingConfig {
  [key: string]: PlatformPricing;
}

export interface ComplexityResult {
    score: number;
    category: 'simple' | 'moderate' | 'complex' | 'enterprise';
    categoryLabel: string;
    logicLabel: string;
}

export interface QuoteBreakdown {
    subtotal: number;
    volumeDiscountAmount: number;
    volumeDiscountPercent: number;
    timelineAdjustment: number;
    supportCost: number;
    customAdjustmentAmount: number;
    finalTotal: number;
    minRange: number;
    maxRange: number;
}
