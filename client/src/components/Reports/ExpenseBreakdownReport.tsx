import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  TrendingUp, 
  CalendarDays, 
  Layers, 
  ArrowUpRight, 
  DollarSign 
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils'; // Adjust path based on your utilities placement

// This matches the exact array of objects structure returned from your MongoDB aggregation
const dummyAggregationOutput = [
  { _id: "Wages", total: 350000, count: 14 },
  { _id: "Utilities", total: 85000, count: 6 },
  { _id: "Stationery", total: 42500, count: 12 },
  { _id: "Maintenance", total: 18000, count: 3 },
  { _id: "Food", total: 12000, count: 2 }
];

const ExpenseBreakdownReport = () => {
  // Set default state dates for the current calendar month cycle
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-31");

  // Calculate global aggregate totals across all categories dynamically
  const { grossSpending, totalTransactions } = useMemo(() => {
    return dummyAggregationOutput.reduce((acc, current) => {
      return {
        grossSpending: acc.grossSpending + current.total,
        totalTransactions: acc.totalTransactions + current.count
      };
    }, { grossSpending: 0, totalTransactions: 0 });
  }, []);

  // Find the highest expenditure for progress bar scaling constraints
  const peakExpenseVal = dummyAggregationOutput[0]?.total || 1;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="text-indigo-600" size={20} />
            Operating Expenditure Analysis
          </h3>
          <p className="text-xs text-gray-500">
            Categorized breakdown of institutional expenses compiled from database ledger records.
          </p>
        </div>
      </div>

      {/* FILTER CONSOLE PANEL */}
      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-4">
        {/* Start Date Control */}
        <div className="space-y-1.5 w-full sm:flex-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <CalendarDays size={12} className="text-indigo-500" />
            Analysis Start Date
          </label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
          />
        </div>

        {/* End Date Control */}
        <div className="space-y-1.5 w-full sm:flex-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <CalendarDays size={12} className="text-indigo-500" />
            Analysis End Date
          </label>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* METRIC SUMMARIES LAYER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gross Expenditures</p>
            <p className="text-2xl font-black text-gray-900">{formatCurrency(grossSpending)}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Processed Vouchers</p>
            <p className="text-2xl font-black text-gray-900">{totalTransactions} Receipts</p>
          </div>
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
            <Layers size={18} />
          </div>
        </div>
      </div>

      {/* DUAL COLUMN ANALYSIS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Hand View: Visual Proportional Scaling Bars */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-7 space-y-5">
          <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-50 pb-3">
            <TrendingUp size={16} className="text-indigo-600" />
            Proportional Spending Distribution
          </h4>
          <div className="space-y-5">
            {dummyAggregationOutput.map((item) => {
              // Scale proportions relative to the absolute highest element in the pipeline result
              const structuralWidth = Math.round((item.total / peakExpenseVal) * 100);

              return (
                <div key={item._id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-700">{item._id}</span>
                    <span className="text-gray-900">{((item.total / grossSpending) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${structuralWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Hand View: Detailed Structured Ledger Metrics */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-gray-900 text-sm border-b border-gray-50 pb-3 mb-4">
              Category Distribution Matrix
            </h4>
            <div className="divide-y divide-gray-50">
              {dummyAggregationOutput.map((item) => (
                <div key={item._id} className="py-3 flex justify-between items-center group hover:bg-gray-50/40 px-1 rounded-xl transition-colors">
                  <div>
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      {item._id}
                      <ArrowUpRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">Based on {item.count} standalone transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">{formatCurrency(item.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50/50 p-3 rounded-2xl text-[10px] text-gray-400 font-bold tracking-tight text-center uppercase border border-slate-100/50 mt-4">
            Analysis scope bound to values between: {startDate} and {endDate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseBreakdownReport;