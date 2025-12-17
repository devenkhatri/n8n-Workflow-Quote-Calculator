import { PRICING } from './constants';
import { Workflow, ComplexityResult, PlatformType } from './types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const getComplexityDetails = (w: Workflow): ComplexityResult => {
    const score = (w.nodes / 10) + (w.integrations * 2) + w.logic;
    
    let category: ComplexityResult['category'] = 'simple';
    if (score >= 40) category = 'enterprise';
    else if (score >= 20) category = 'complex';
    else if (score >= 10) category = 'moderate';

    let categoryLabel = 'Single-App';
    if (w.integrations > 4) categoryLabel = 'Cross-Stack';
    else if (w.integrations > 1) categoryLabel = 'Multi-App';

    let logicLabel = 'Simple';
    if (w.logic > 8) logicLabel = 'High';
    else if (w.logic > 3) logicLabel = 'Moderate';

    return { score, category, categoryLabel, logicLabel };
};

export const calculateWorkflowPrice = (w: Workflow, platform: string): number => {
    const { category } = getComplexityDetails(w);
    const platformData = PRICING[platform as PlatformType];
    
    if (!platformData) return 0;

    const basePrice = platformData[category].base;
    const nodeMultiplier = 1 + (w.nodes / 100) * 0.5;
    const integMultiplier = 1 + (w.integrations / 10) * 0.6;
    const logicMultiplier = 1 + (w.logic / 20) * 0.8;

    return Math.round(basePrice * nodeMultiplier * integMultiplier * logicMultiplier);
};

export const getVolumeDiscountRate = (count: number): number => {
    if (count >= 10) return 0.20;
    if (count >= 5) return 0.15;
    if (count >= 3) return 0.10;
    return 0;
};
