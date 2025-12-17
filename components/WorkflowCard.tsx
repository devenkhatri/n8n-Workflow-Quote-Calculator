import React, { useMemo } from 'react';
import { Trash2, ChevronDown, ChevronUp, Activity, Share2, Network } from 'lucide-react';
import { Workflow } from '../types';
import { getComplexityDetails, calculateWorkflowPrice, formatCurrency } from '../utils';

interface WorkflowCardProps {
  workflow: Workflow;
  index: number;
  platform: string;
  onUpdate: (id: number, field: keyof Workflow, value: number) => void;
  onRemove: (id: number) => void;
  onToggleExpand: (id: number) => void;
  totalWorkflows: number;
}

export const WorkflowCard: React.FC<WorkflowCardProps> = ({
  workflow,
  index,
  platform,
  onUpdate,
  onRemove,
  onToggleExpand,
  totalWorkflows
}) => {
  const price = useMemo(() => calculateWorkflowPrice(workflow, platform), [workflow, platform]);
  const details = useMemo(() => getComplexityDetails(workflow), [workflow]);

  return (
    <div 
      className={`border rounded-lg mb-4 overflow-hidden transition-all duration-200 ${
        workflow.isExpanded 
          ? 'bg-white border-primary-200 shadow-md scale-[1.01]' 
          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
      }`}
    >
      {/* Header */}
      <div 
        className="flex justify-between items-center p-4 cursor-pointer select-none"
        onClick={() => onToggleExpand(workflow.id)}
      >
        <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${workflow.isExpanded ? 'bg-primary-100 text-primary-700' : 'bg-slate-200 text-slate-600'}`}>
                {workflow.isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            <span className="font-semibold text-slate-700">Workflow {index + 1}</span>
            {!workflow.isExpanded && (
                <span className="text-xs text-slate-500 bg-white border px-2 py-0.5 rounded-full">
                    {details.logicLabel} • {details.categoryLabel}
                </span>
            )}
        </div>
        <div className="text-primary-700 font-bold">
            {formatCurrency(price)}
        </div>
      </div>

      {/* Expanded Content */}
      {workflow.isExpanded && (
        <div className="p-4 pt-0 border-t border-slate-200/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            
            {/* Nodes Slider */}
            <div className="col-span-1 md:col-span-2">
               <div className="flex justify-between mb-2">
                 <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
                    <Activity size={12} /> Nodes
                 </label>
                 <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                    {workflow.nodes}
                 </span>
               </div>
               <input 
                 type="range" 
                 min="1" 
                 max="100" 
                 value={workflow.nodes}
                 onChange={(e) => onUpdate(workflow.id, 'nodes', parseInt(e.target.value))}
                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-700 hover:accent-primary-600"
               />
            </div>

            {/* Integrations Slider */}
            <div>
               <div className="flex justify-between mb-2">
                 <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
                    <Share2 size={12} /> Integrations
                 </label>
                 <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                    {workflow.integrations}
                 </span>
               </div>
               <input 
                 type="range" 
                 min="0" 
                 max="10" 
                 value={workflow.integrations}
                 onChange={(e) => onUpdate(workflow.id, 'integrations', parseInt(e.target.value))}
                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-700 hover:accent-primary-600"
               />
            </div>

            {/* Logic Complexity Slider */}
            <div>
               <div className="flex justify-between mb-2">
                 <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
                    <Network size={12} /> Logic Complexity
                 </label>
                 <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                    {workflow.logic}
                 </span>
               </div>
               <input 
                 type="range" 
                 min="0" 
                 max="20" 
                 value={workflow.logic}
                 onChange={(e) => onUpdate(workflow.id, 'logic', parseInt(e.target.value))}
                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-700 hover:accent-primary-600"
               />
            </div>
          </div>

          {/* Stats Footer */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
             <div className="text-center">
                <span className="block text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Complexity</span>
                <span className="block text-sm font-bold text-slate-700">{details.logicLabel}</span>
             </div>
             <div className="text-center border-l border-slate-200">
                <span className="block text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Category</span>
                <span className="block text-sm font-bold text-slate-700">{details.categoryLabel}</span>
             </div>
             <div className="flex items-center justify-end">
                {totalWorkflows > 1 && (
                    <button 
                        onClick={() => onRemove(workflow.id)}
                        className="text-xs flex items-center gap-1 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
                    >
                        <Trash2 size={12} /> Remove
                    </button>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};