import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Copy, Info, AlertCircle, Clock, CheckCircle, BookOpen } from 'lucide-react';
import { Workflow, PlatformType, QuoteBreakdown } from './types';
import { INITIAL_WORKFLOW } from './constants';
import { WorkflowCard } from './components/WorkflowCard';
import { PricingGuideModal } from './components/PricingGuideModal';
import { calculateWorkflowPrice, getVolumeDiscountRate, formatCurrency, getComplexityDetails } from './utils';

const App: React.FC = () => {
  // Initialize workflows from URL params if present, otherwise use default
  const [workflows, setWorkflows] = useState<Workflow[]>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('nodes')) {
        return [{
          id: 1,
          nodes: parseInt(params.get('nodes') || '15'),
          integrations: parseInt(params.get('integrations') || '2'),
          logic: parseInt(params.get('logic') || '5'),
          isExpanded: true
        }];
      }
    }
    return [{ ...INITIAL_WORKFLOW }];
  });

  const [platform, setPlatform] = useState<PlatformType>('agency');
  const [timeline, setTimeline] = useState<number>(0);
  const [support, setSupport] = useState<number>(0);
  const [adjustment, setAdjustment] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [isPriceAnimating, setIsPriceAnimating] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const nextIdRef = useRef(workflows.length + 1);

  const addWorkflow = () => {
    setWorkflows(prev => [
      ...prev.map(w => ({ ...w, isExpanded: false })), // Collapse others
      { 
        id: nextIdRef.current++, 
        nodes: 5, 
        integrations: 2, 
        logic: 5,
        isExpanded: true 
      }
    ]);
  };

  const removeWorkflow = (id: number) => {
    if (workflows.length <= 1) return;
    setWorkflows(prev => prev.filter(w => w.id !== id));
  };

  const updateWorkflow = (id: number, field: keyof Workflow, value: number) => {
    setWorkflows(prev => prev.map(w => 
      w.id === id ? { ...w, [field]: value } : w
    ));
  };

  const toggleExpand = (id: number) => {
    setWorkflows(prev => prev.map(w => 
      w.id === id ? { ...w, isExpanded: !w.isExpanded } : w
    ));
  };

  // Calculations
  const quoteData: QuoteBreakdown = useMemo(() => {
    let subtotal = 0;
    workflows.forEach(w => {
      subtotal += calculateWorkflowPrice(w, platform);
    });

    const volumeDiscountRate = getVolumeDiscountRate(workflows.length);
    const volumeDiscountAmount = subtotal * volumeDiscountRate;
    const subtotalAfterDiscount = subtotal - volumeDiscountAmount;

    const timelineAdjustment = subtotalAfterDiscount * timeline;
    const supportCost = subtotalAfterDiscount * support;
    
    // Applying adjustment to the running total
    const runningTotal = subtotalAfterDiscount + timelineAdjustment + supportCost;
    const customAdjustmentAmount = runningTotal * (adjustment / 100);

    const finalTotal = Math.round(runningTotal + customAdjustmentAmount);

    return {
      subtotal,
      volumeDiscountAmount,
      volumeDiscountPercent: volumeDiscountRate * 100,
      timelineAdjustment,
      supportCost,
      customAdjustmentAmount,
      finalTotal,
      minRange: Math.round(subtotal * 0.85),
      maxRange: Math.round(finalTotal * 1.15)
    };
  }, [workflows, platform, timeline, support, adjustment]);

  // Trigger animation when final total changes
  useEffect(() => {
    setIsPriceAnimating(true);
    const timer = setTimeout(() => setIsPriceAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [quoteData.finalTotal]);

  const handleCopyQuote = async () => {
    let summary = `N8N Workflow Quote Estimate\n`;
    summary += `---------------------------\n`;
    summary += `Total Workflows: ${workflows.length}\n`;
    summary += `Total Quote: ${formatCurrency(quoteData.finalTotal)}\n`;
    summary += `Price Range: ${formatCurrency(quoteData.minRange)} - ${formatCurrency(quoteData.maxRange)}\n\n`;
    summary += `Breakdown:\n`;
    
    workflows.forEach((w, idx) => {
      const price = calculateWorkflowPrice(w, platform);
      const details = getComplexityDetails(w);
      summary += `${idx + 1}. ${details.logicLabel} ${details.categoryLabel} (${w.nodes} nodes) - ${formatCurrency(price)}\n`;
    });

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto font-sans">
      <header className="text-center mb-8 relative">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
          🚀 N8N Workflow Quote Calculator
        </h1>
        <p className="text-slate-500 text-sm md:text-base mb-4">
          Estimate project cost based on complexity, integrations, and platform
        </p>
        <button 
          onClick={() => setIsGuideOpen(true)}
          className="inline-flex items-center gap-2 text-sm text-primary-700 bg-primary-50 px-4 py-2 rounded-full font-medium hover:bg-primary-100 transition-colors shadow-sm"
        >
          <BookOpen size={16} /> View Pricing Definitions
        </button>
      </header>

      <PricingGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls & Workflows */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                📋 Workflow Management
                <span className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full border border-primary-200">
                  {workflows.length}
                </span>
              </h2>
              <button 
                onClick={addWorkflow}
                className="bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
              >
                <Plus size={16} /> Add Workflow
              </button>
            </div>

            <div className="space-y-4">
              {workflows.map((workflow, idx) => (
                <WorkflowCard
                  key={workflow.id}
                  index={idx}
                  workflow={workflow}
                  platform={platform}
                  onUpdate={updateWorkflow}
                  onRemove={removeWorkflow}
                  onToggleExpand={toggleExpand}
                  totalWorkflows={workflows.length}
                />
              ))}
            </div>

            <div className="mt-6 bg-primary-50 border-l-4 border-primary-600 p-4 rounded-r-md">
              <div className="flex gap-3">
                <Info className="text-primary-700 shrink-0 mt-0.5" size={18} />
                <div className="text-xs text-slate-600">
                  <strong>Volume Discount:</strong> 3+ workflows: 10% off | 5+: 15% off | 10+: 20% off
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Project Configuration</h3>
            
            {/* Platform Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Pricing Platform</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'fiverr', label: '💎 Fiverr' },
                  { id: 'upwork', label: '🔗 Upwork' },
                  { id: 'agency', label: '🏢 Agency' },
                  { id: 'india', label: '🇮🇳 Direct (India)' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id as PlatformType)}
                    className={`
                      py-3 px-2 rounded-lg text-sm font-medium border-2 transition-all
                      ${platform === p.id 
                        ? 'border-primary-700 bg-primary-700 text-white shadow-md' 
                        : 'border-slate-200 bg-white text-slate-600 hover:border-primary-400 hover:text-primary-700'}
                    `}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Timeline</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 text-slate-400" size={16} />
                  <select 
                    value={timeline}
                    onChange={(e) => setTimeline(parseFloat(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  >
                    <option value={0.25}>Rush (1-2 days) • +25%</option>
                    <option value={0}>Standard (3-7 days) • Base</option>
                    <option value={-0.1}>Extended (2 weeks+) • -10%</option>
                  </select>
                </div>
              </div>

              {/* Support */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Post-Launch Support</label>
                <div className="relative">
                   <AlertCircle className="absolute left-3 top-3 text-slate-400" size={16} />
                   <select 
                     value={support}
                     onChange={(e) => setSupport(parseFloat(e.target.value))}
                     className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                   >
                     <option value={0}>None • Base</option>
                     <option value={0.15}>30-day Support • +15%</option>
                     <option value={0.3}>90-day Support • +30%</option>
                   </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Quote Summary (Sticky) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-6">
            <div className="bg-primary-700 text-white rounded-t-xl p-6 shadow-lg overflow-hidden">
              <div className="text-xs font-bold uppercase tracking-widest text-primary-200 mb-2">Total Project Cost</div>
              <div className={`text-4xl font-bold mb-2 tracking-tight transition-transform duration-300 origin-left ${isPriceAnimating ? 'scale-105 text-primary-100' : ''}`}>
                {formatCurrency(quoteData.finalTotal)}
              </div>
              <div className="text-sm text-primary-100 opacity-90">
                Range: {formatCurrency(quoteData.minRange)} - {formatCurrency(quoteData.maxRange)}
              </div>
            </div>

            <div className="bg-white border-x border-b border-slate-200 rounded-b-xl shadow-lg p-6">
              <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Itemized Breakdown</h4>
              
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {workflows.map((w, idx) => (
                   <div key={w.id} className="flex justify-between text-sm py-1 border-b border-slate-100 last:border-0">
                      <span className="text-slate-500">Workflow {idx + 1}</span>
                      <span className="font-semibold text-slate-700">{formatCurrency(calculateWorkflowPrice(w, platform))}</span>
                   </div>
                ))}
              </div>

              <div className="border-t-2 border-slate-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Subtotal</span>
                  <span className="font-bold text-slate-800">{formatCurrency(quoteData.subtotal)}</span>
                </div>

                {quoteData.volumeDiscountAmount > 0 && (
                   <div className="flex justify-between text-sm text-green-600">
                     <span>Volume Discount ({Math.round(quoteData.volumeDiscountPercent)}%)</span>
                     <span>-{formatCurrency(quoteData.volumeDiscountAmount)}</span>
                   </div>
                )}

                {quoteData.timelineAdjustment !== 0 && (
                   <div className="flex justify-between text-sm text-slate-500">
                     <span>Timeline Adjustment</span>
                     <span>{quoteData.timelineAdjustment > 0 ? '+' : ''}{formatCurrency(quoteData.timelineAdjustment)}</span>
                   </div>
                )}

                {quoteData.supportCost > 0 && (
                   <div className="flex justify-between text-sm text-slate-500">
                     <span>Support Package</span>
                     <span>+{formatCurrency(quoteData.supportCost)}</span>
                   </div>
                )}
              </div>

              {/* Custom Adjustment Slider */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex justify-between mb-2">
                   <label className="text-xs font-semibold uppercase text-slate-500">Custom Adjustment</label>
                   <span className={`text-xs font-bold px-2 py-0.5 rounded ${adjustment >= 0 ? 'bg-slate-100 text-slate-700' : 'bg-red-50 text-red-600'}`}>
                     {adjustment > 0 ? '+' : ''}{adjustment}%
                   </span>
                </div>
                <input 
                  type="range" 
                  min="-20" 
                  max="50" 
                  value={adjustment}
                  onChange={(e) => setAdjustment(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500"
                />
                <div className="text-[10px] text-slate-400 mt-1 text-center">Apply markup or additional discount</div>
              </div>

              <button 
                onClick={handleCopyQuote}
                className={`
                  w-full mt-6 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200
                  ${copied 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-slate-800 hover:bg-slate-900 text-white'}
                `}
              >
                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                {copied ? 'Copied to Clipboard' : 'Copy Full Quote'}
              </button>
            </div>

            <div className="mt-4 bg-slate-100 p-3 rounded-lg border border-slate-200">
               <p className="text-xs text-slate-500 leading-relaxed text-center">
                 <strong>Note:</strong> This is an estimate for {workflows.length} workflow(s). Final pricing may vary based on client requirements.
               </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;