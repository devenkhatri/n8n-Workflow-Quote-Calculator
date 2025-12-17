import React from 'react';
import { X } from 'lucide-react';

interface PricingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingGuideModal: React.FC<PricingGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const data = [
    {
      category: "Simple Single-App",
      nodes: "1-5",
      integrations: "0-1",
      logic: "Simple",
      agency: "₹5,000 - ₹10,000",
      fiverr: "₹4,150 - ₹8,300",
      upwork: "₹12,450 - ₹24,900",
      india: "₹16,600 - ₹49,800"
    },
    {
      category: "Simple Multi-App",
      nodes: "5-10",
      integrations: "2-3",
      logic: "Simple",
      agency: "₹10,000 - ₹17,000",
      fiverr: "₹8,300 - ₹16,600",
      upwork: "₹24,900 - ₹41,500",
      india: "₹24,900 - ₹82,800"
    },
    {
      category: "Moderate Single-App",
      nodes: "11-20",
      integrations: "0-1",
      logic: "Moderate",
      agency: "₹17,000 - ₹25,000",
      fiverr: "₹16,600 - ₹24,900",
      upwork: "₹41,500 - ₹66,400",
      india: "₹41,500 - ₹124,500"
    },
    {
      category: "Moderate Multi-App",
      nodes: "11-30",
      integrations: "2-4",
      logic: "Moderate",
      agency: "₹25,000 - ₹35,000",
      fiverr: "₹24,900 - ₹41,500",
      upwork: "₹66,400 - ₹107,900",
      india: "₹66,400 - ₹199,200"
    },
    {
      category: "Complex Single-App",
      nodes: "21-50",
      integrations: "0-2",
      logic: "High",
      agency: "₹35,000 - ₹52,000",
      fiverr: "₹33,200 - ₹66,400",
      upwork: "₹82,800 - ₹166,000",
      india: "₹124,500 - ₹298,800"
    },
    {
      category: "Complex Multi-App",
      nodes: "20-50",
      integrations: "3-5",
      logic: "High",
      agency: "₹52,000 - ₹110,000",
      fiverr: "₹49,800 - ₹107,900",
      upwork: "₹124,500 - ₹248,000",
      india: "₹166,000 - ₹415,000"
    },
    {
      category: "Enterprise Orchestrator",
      nodes: "50+",
      integrations: "5+",
      logic: "Very High",
      agency: "₹110,000+",
      fiverr: "₹107,900+",
      upwork: "₹248,000+",
      india: "₹298,800 - ₹831,000+"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Workflow Pricing Categories (INR)</h2>
            <p className="text-sm text-slate-500 mt-1">Pricing varies significantly by platform and complexity</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-auto flex-1 p-6">
          <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
            <thead className="text-xs text-slate-700 uppercase bg-primary-50">
              <tr>
                <th className="px-4 py-3 font-bold border border-primary-100 rounded-tl-lg">Category</th>
                <th className="px-4 py-3 font-bold border border-primary-100 bg-primary-100/50">Node Count</th>
                <th className="px-4 py-3 font-bold border border-primary-100 bg-primary-100/50">Integrations</th>
                <th className="px-4 py-3 font-bold border border-primary-100 bg-primary-100/50">Logic Complexity</th>
                <th className="px-4 py-3 font-bold border border-primary-100 bg-purple-50 text-purple-800 border-l-2 border-l-purple-200">Agency Price</th>
                <th className="px-4 py-3 font-bold border border-primary-100 bg-emerald-50 text-emerald-800">Fiverr Price</th>
                <th className="px-4 py-3 font-bold border border-primary-100 bg-blue-50 text-blue-800">Upwork Price</th>
                <th className="px-4 py-3 font-bold border border-primary-100 rounded-tr-lg bg-orange-50 text-orange-800">India Freelancer</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800 border-x border-slate-100">{row.category}</td>
                  <td className="px-4 py-3 text-slate-600 border-x border-slate-100 text-center">{row.nodes}</td>
                  <td className="px-4 py-3 text-slate-600 border-x border-slate-100 text-center">{row.integrations}</td>
                  <td className="px-4 py-3 text-slate-600 border-x border-slate-100 text-center">{row.logic}</td>
                  <td className="px-4 py-3 text-purple-700 font-bold border-x border-slate-100 bg-purple-50/30 border-l-purple-200">{row.agency}</td>
                  <td className="px-4 py-3 text-emerald-700 font-medium border-x border-slate-100 bg-emerald-50/30">{row.fiverr}</td>
                  <td className="px-4 py-3 text-blue-700 font-medium border-x border-slate-100 bg-blue-50/30">{row.upwork}</td>
                  <td className="px-4 py-3 text-orange-700 font-medium border-x border-slate-100 bg-orange-50/30">{row.india}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
           Note: "Agency" pricing represents our balanced market rate, offering better reliability than low-cost options without the high overhead of large firms.
        </div>
      </div>
    </div>
  );
};