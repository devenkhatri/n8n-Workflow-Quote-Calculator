# N8N Workflow Quote Calculator - React Application

A professional-grade React application for estimating n8n workflow automation project costs with configurable pricing across multiple platforms (Fiverr, Upwork, India-based freelancers).

## Key Features

1. **Configurable Pricing Tiers**: Easily edit INR pricing ranges for each platform and complexity level
2. **Multiple Workflows**: Add/remove workflows and see aggregate pricing with volume discounts
3. **Real-Time Calculations**: All calculations update instantly as inputs change
4. **Context API State Management**: Centralized state for pricing configuration and workflow data
5. **Volume Discounts**: 10% for 3+, 15% for 5+, 20% for 10+ workflows
6. **Platform-Specific Pricing**: Fiverr, Upwork, and India-based freelancer rates
7. **Detailed Breakdown**: Itemized cost display with multiplier calculations
8. **Export Quote**: Copy full quote to clipboard with per-workflow breakdown
9. **Responsive Design**: Mobile-friendly layout using CSS Grid

## Implementation Details

### Technologies
- React 18+ with Hooks
- Context API for state management
- Vite for fast development
- CSS Grid/Flexbox for responsive layout

### State Management Architecture
- **PricingContext**: Stores platform pricing configuration (editable)
- **CalculatorContext**: Manages workflow data, selected platform, timeline, support options
- **Custom Hooks**: Encapsulate calculation logic for reusability

### Calculation Logic
1. **Per-Workflow Price**: basePrice × nodeMultiplier × integrationMultiplier × logicMultiplier
2. **Subtotal**: Sum of all workflow prices
3. **Volume Discount**: Applied based on number of workflows
4. **Timeline & Support**: Added as percentages to discounted subtotal
5. **Custom Adjustment**: Final markup/discount percentage applied
6. **Final Quote**: Subtotal - discount + timeline + support + adjustment

### Pricing Formula Per Platform

#### Fiverr (Base Prices in ₹)
- Simple: ₹4,150–₹8,300
- Moderate: ₹16,600–₹24,900
- Complex: ₹33,200–₹49,800
- Enterprise: ₹107,900–₹166,000

#### Upwork (Base Prices in ₹)
- Simple: ₹12,450–₹24,900
- Moderate: ₹41,500–₹66,400
- Complex: ₹82,800–₹124,500
- Enterprise: ₹248,000–₹414,000

#### India-Based (Base Prices in ₹)
- Simple: ₹16,600–₹49,800
- Moderate: ₹66,400–₹124,500
- Complex: ₹124,500–₹298,800
- Enterprise: ₹298,800–₹831,000

### Multipliers
- **Node Multiplier**: 1 + (nodes/100) × 0.5
- **Integration Multiplier**: 1 + (integrations/10) × 0.6
- **Logic Multiplier**: 1 + (logicScore/20) × 0.8

### Complexity Bands
- **Simple**: Logic score 0–3
- **Moderate**: Logic score 4–8
- **High**: Logic score 9+

### Workflow Categories
- **Single-App**: 0–1 integrations
- **Multi-App**: 2–4 integrations
- **Cross-Stack**: 5+ integrations

## Usage Instructions

### Installation

```bash
npm create vite@latest n8n-quote-calculator -- --template react
cd n8n-quote-calculator
npm install
npm run dev
```

### Configuring Pricing

Access the PricingConfig component to update INR ranges for each platform:

```javascript
const defaultPricing = {
  fiverr: {
    simple: { min: 4150, base: 8300 },
    moderate: { min: 16600, base: 24900 },
    complex: { min: 33200, base: 49800 },
    enterprise: { min: 107900, base: 166000 }
  },
  upwork: { /* ... */ },
  india: { /* ... */ }
};
```

### Using the Calculator

1. Select a platform (Fiverr, Upwork, India-based)
2. Add workflows using +Add Workflow button
3. Configure each workflow: nodes, integrations, logic complexity
4. Adjust timeline and support options
5. Apply custom markup/discount if needed
6. Copy quote to clipboard

## Benefits for Your Consultancy

- **Quick Estimation**: Provide accurate quotes in real-time during sales calls
- **Transparent Pricing**: Show clients exactly how pricing is calculated
- **Volume Efficiency**: Automatically apply discounts for multi-workflow projects
- **Competitive Pricing**: Easily adjust rates based on market changes or client segments
- **Professional Appearance**: Modern UI builds confidence with enterprise clients
- **Scalability**: Add new pricing tiers, platforms, or discount models easily

## Future Enhancements

- Export quotes as PDF with branding
- Save quote templates and reuse them
- Add retainer/maintenance pricing options
- Integrate with CRM (HubSpot, Salesforce)
- Multi-currency support
- Analytics: track average project complexity, popular integrations
- Client portal for quote sharing and approval
