import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  CalendarDays, 
  Layers, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Badge } from '../Badge'; // Adjust based on your Badge component placement

// Array structure matching your getFeeCollection output
const dummyFeeCollectionOutput = [
  {
    grade: { _id: "g1", name: "Grade 1", stream: "North" },
    term: "Term 1",
    year: "2026",
    expected: 45000,
    collected: 38500,
    outstanding: 6500
  },
  {
    grade: { _id: "g2", name: "Grade 2", stream: "South" },
    term: "Term 1",
    year: "2026",
    expected: 48000,
    collected: 48000,
    outstanding: 0
  },
  {
    grade: { _id: "g3", name: "Grade 3", stream: "East" },
    term: "Term 1",
    year: "2026",
    expected: 50000,
    collected: 12000,
    outstanding: 38000
  }
];

const FeeCollectionReport = () => {
  // Local state controls for your explicit function parameters
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [selectedTerm, setSelectedTerm] = useState<string>("Term 1");

  // Dynamically compute summaries out of the active data stream
  const summaries = useMemo(() => {
    return dummyFeeCollectionOutput.reduce((acc, curr) => {
      return {
        totalExpected: acc.totalExpected + curr.expected,
        totalCollected: acc.totalCollected + curr.collected,
        totalOutstanding: acc.totalOutstanding + curr.outstanding
      };
    }, { totalExpected: 0, totalCollected: 0, totalOutstanding: 0 });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Wallet className="text-indigo-600" size={20} />
          Structural Fee Collection Audits
        </h3>
        <p className="text-xs text-gray-500">
          Real-time reconciliation of expected institutional fees against raw incoming payments.
        </p>
      </div>

      {/* FILTER CONSOLE PANEL */}
      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-4">
        {/* Year Filter */}
        <div className="space-y-1.5 w-full sm:flex-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <CalendarDays size={12} className="text-indigo-500" />
            Academic Year
          </label>
          <input 
            type="number" 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>

        {/* Term Filter Dropdown */}
        <div className="space-y-1.5 w-full sm:flex-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Layers size={12} className="text-indigo-500" />
            Target School Term
          </label>
          <select 
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
          >
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>
      </div>

      {/* MINI HIGHLIGHT BANNER TRACKS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><DollarSign size={16} /></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Gross Revenue Expected</p>
            <p className="text-base font-black text-gray-900">{formatCurrency(summaries.totalExpected)}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={16} /></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Gross Revenue Realized</p>
            <p className="text-base font-black text-emerald-600">{formatCurrency(summaries.totalCollected)}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2 bg-red-50 text-red-600 rounded-xl"><AlertTriangle size={16} /></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Total Arrears Balance</p>
            <p className="text-base font-black text-red-600">{formatCurrency(summaries.totalOutstanding)}</p>
          </div>
        </div>
      </div>

      {/* COLLECTION AUDIT DATA MATRIX TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
          <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-600" />
            Class-level Collection Analysis Matrix
          </h4>
          <span className="text-[10px] bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl text-gray-400 font-bold uppercase tracking-wider">
            Scope: {selectedTerm} • {selectedYear}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] uppercase font-black text-gray-400 tracking-wider">
              <tr>
                <th className="px-6 py-4">Target Grade / Stream</th>
                <th className="px-6 py-4">Expected Value</th>
                <th className="px-6 py-4">Collected Value</th>
                <th className="px-6 py-4">Outstanding Arrears</th>
                <th className="px-6 py-4">Collection Rate</th>
                <th className="px-6 py-4">Status Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dummyFeeCollectionOutput.map((row) => {
                const collectionRate = row.expected > 0 ? (row.collected / row.expected) * 100 : 0;

                return (
                  <tr key={row.grade._id} className="hover:bg-gray-50/40 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                        {row.grade.name}
                        <ChevronRight size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{row.grade.stream} Stream</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{formatCurrency(row.expected)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">{formatCurrency(row.collected)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-red-600">
                      {row.outstanding === 0 ? (
                        <span className="text-xs text-emerald-500 font-medium italic">Settled</span>
                      ) : (
                        formatCurrency(row.outstanding)
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              collectionRate >= 100 ? 'bg-emerald-500' : collectionRate > 50 ? 'bg-indigo-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(collectionRate, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-700">{collectionRate.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={collectionRate >= 100 ? 'active' : collectionRate > 50 ? 'pending' : 'absent'}>
                        {collectionRate >= 100 ? 'Fully Paid' : collectionRate > 50 ? 'Partial' : 'Critical'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeeCollectionReport;