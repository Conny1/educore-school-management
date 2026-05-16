import React, { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  BarChart3, 
  Package, 
  Users, 
  CalendarDays, 
  Filter 
} from 'lucide-react';
import { grades } from '../../mock/data'; // Importing your mock grades data for the dropdown

// This matches the exact structure of your function's sample output array
const dummyFulfillmentData = [
  {
    item: "A4 Exercise Books (120 pages)",
    required: 10,
    unit: "pcs",
    totalStudents: 50,
    fullyMet: 32,
    partial: 12,
    notBrought: 6,
    gradeId: "grade-1", // added for local filtering simulation
    year: "2026"
  },
  {
    item: "Photocopying Paper (Ream)",
    required: 2,
    unit: "reams",
    totalStudents: 50,
    fullyMet: 41,
    partial: 0,
    notBrought: 9,
    gradeId: "grade-2",
    year: "2026"
  },
  {
    item: "Mathematical Set",
    required: 1,
    unit: "set",
    totalStudents: 50,
    fullyMet: 15,
    partial: 0,
    notBrought: 35,
    gradeId: "grade-1",
    year: "2025"
  }
];

const SchoolRequirementsReport = () => {
  // Local states for the requirement filters
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedGradeId, setSelectedGradeId] = useState<string>('all');
  const [term, setterm] = useState("Term 1")

  // Dynamically filter data based on selected filters
  const filteredData = useMemo(() => {
    return dummyFulfillmentData.filter(data => {
      const matchesYear = data.year === selectedYear;
      const matchesGrade = selectedGradeId === 'all' || data.gradeId === selectedGradeId;
      return matchesYear && matchesGrade;
    });
  }, [selectedYear, selectedGradeId]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="text-indigo-600" size={20} />
            Material & Requirement Fulfillment Analytics
          </h3>
          <p className="text-xs text-gray-500">
            Real-time tracking of student material submissions for the active grade and term.
          </p>
        </div>
      </div>

      {/* FILTER BAR PANEL CONTAINER */}
      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-end gap-4">
        {/* Year Input Control */}
        <div className="space-y-1.5 w-full sm:w-44">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <CalendarDays size={12} className="text-indigo-500" />
            Academic Year
          </label>
          <input 
            type="number" 
            placeholder="e.g. 2026"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
          />
        </div>
        {/* TERM */}
          <div className="space-y-1.5 w-full sm:w-60">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Filter size={12} className="text-indigo-500" />
Term          </label>
          <select 
            value={selectedGradeId}
            onChange={(e) => setterm(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
          >
            <option value="all">All Grades Combined</option>
            {["Term 1", "Term 2", "Term 3"]?.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Grade Dropdown Control */}
        <div className="space-y-1.5 w-full sm:w-60">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Filter size={12} className="text-indigo-500" />
            Target Level / Grade
          </label>
          <select 
            value={selectedGradeId}
            onChange={(e) => setSelectedGradeId(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
          >
            <option value="all">All Grades Combined</option>
            {grades?.map((g: any) => (
              <option key={g.id || g._id} value={g.id || g._id}>
                {g.name} {g.stream ? `(${g.stream})` : ''}
              </option>
            ))}
          </select>
        </div>

      
      </div>

      {/* Main Grid mapping through filtered output */}
      {filteredData.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center text-sm text-gray-400 font-medium italic">
          No requirement data matching the selected year and grade filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {filteredData.map((data, index) => {
            const fulfillmentRate = Math.round((data.fullyMet / data.totalStudents) * 100);

            return (
              <div 
                key={index} 
                className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Item Info Header */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                      <Package size={20} />
                    </div>
                    <span className="text-[11px] font-black text-indigo-600 bg-indigo-50/70 border border-indigo-100 px-2.5 py-1 rounded-xl uppercase tracking-wider">
                      Req: {data.required} {data.unit}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-base tracking-tight line-clamp-1 mb-4">
                    {data.item}
                  </h4>

                  {/* Progress Bar Display */}
                  <div className="space-y-1.5 mb-6">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-500">Fulfillment Rate</span>
                      <span className="text-indigo-600">{fulfillmentRate}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${fulfillmentRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Status Breakdowns */}
                <div className="space-y-2.5 pt-4 border-t border-gray-50">
                  {/* Fully Met */}
                  <div className="flex items-center justify-between p-2 bg-emerald-50/40 border border-emerald-100/50 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      Fully Handed In
                    </div>
                    <span className="text-xs font-black text-emerald-700">
                      {data.fullyMet} <span className="text-[10px] font-medium text-emerald-500">/ {data.totalStudents}</span>
                    </span>
                  </div>

                  {/* Partial */}
                  <div className="flex items-center justify-between p-2 bg-amber-50/40 border border-amber-100/50 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                      <AlertCircle size={14} className="text-amber-500" />
                      Partially Brought
                    </div>
                    <span className="text-xs font-black text-amber-700">
                      {data.partial} <span className="text-[10px] font-medium text-amber-500">/ {data.totalStudents}</span>
                    </span>
                  </div>

                  {/* Missing */}
                  <div className="flex items-center justify-between p-2 bg-red-50/40 border border-red-100/50 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-700">
                      <XCircle size={14} className="text-red-500" />
                      Not Brought / Missing
                    </div>
                    <span className="text-xs font-black text-red-700">
                      {data.notBrought} <span className="text-[10px] font-medium text-red-500">/ {data.totalStudents}</span>
                    </span>
                  </div>
                </div>

                {/* Footer Total Metric */}
                <div className="mt-4 pt-3 flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <Users size={12} />
                  Total Enrolled Class: {data.totalStudents} Students
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SchoolRequirementsReport;