import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  HelpCircle, 
  CalendarDays, 
  Filter,
  Users2
} from 'lucide-react';
import { grades } from '../../mock/data'; // Adjust path for your grades dataset

// Exact array structure returned from your StudentAttendance aggregation pipeline
const dummyAttendanceOutput = [
  { _id: "present", count: 1420 },
  { _id: "late", count: 115 },
  { _id: "absent", count: 42 },
  { _id: "excused", count: 18 }
];

const AttendanceSummaryReport = () => {
  // Local states matching filter requirements
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-31");
  const [selectedGradeId, setSelectedGradeId] = useState("all");

  // Calculate gross total logs submitted to find percent ratios
  const totalLogs = useMemo(() => {
    return dummyAttendanceOutput.reduce((acc, current) => acc + current.count, 0);
  }, []);

  // Helper utility to grab structural counts safely (handles missing status objects)
  const getStatusMetrics = (statusKey: string) => {
    const found = dummyAttendanceOutput.find(item => item._id === statusKey);
    const count = found ? found.count : 0;
    const percentage = totalLogs > 0 ? Math.round((count / totalLogs) * 100) : 0;
    return { count, percentage };
  };

  const present = getStatusMetrics('present');
  const late = getStatusMetrics('late');
  const absent = getStatusMetrics('absent');
  const excused = getStatusMetrics('excused');

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Clock className="text-indigo-600" size={20} />
          Student Attendance Metrics Summary
        </h3>
        <p className="text-xs text-gray-500">
          Aggregated roll-call summary tracking institutional presence ratios over time.
        </p>
      </div>

      {/* COMPACT FILTER BAR PANEL */}
      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-4">
        {/* Start Date */}
        <div className="space-y-1.5 w-full sm:flex-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <CalendarDays size={12} className="text-indigo-500" />
            Start Date
          </label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>

        {/* End Date */}
        <div className="space-y-1.5 w-full sm:flex-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <CalendarDays size={12} className="text-indigo-500" />
            End Date
          </label>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>

        {/* Grade Parameter Selector */}
        <div className="space-y-1.5 w-full sm:flex-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Filter size={12} className="text-indigo-500" />
            Target Class Level
          </label>
          <select 
            value={selectedGradeId}
            onChange={(e) => setSelectedGradeId(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
          >
            <option value="all">All School Branches Combined</option>
            {grades?.map((g: any) => (
              <option key={g.id || g._id} value={g.id || g._id}>{g.name} {g.stream ? `(${g.stream})` : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* METRIC CARD DASHBOARD STACK */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Present Card */}
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Present</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 size={14} /></div>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black text-gray-900">{present.count}</p>
            <p className="text-[10px] font-bold text-emerald-600">{present.percentage}% Overall Attendance</p>
          </div>
        </div>

        {/* Late Card */}
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Late Arrivals</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><Clock size={14} /></div>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black text-gray-900">{late.count}</p>
            <p className="text-[10px] font-bold text-amber-600">{late.percentage}% Punctuality Delay</p>
          </div>
        </div>

        {/* Absent Card */}
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Absenteeism</span>
            <div className="p-1.5 bg-red-50 text-red-600 rounded-lg"><XCircle size={14} /></div>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black text-gray-900">{absent.count}</p>
            <p className="text-[10px] font-bold text-red-600">{absent.percentage}% Non-Attendance</p>
          </div>
        </div>

        {/* Excused Card */}
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Excused</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><HelpCircle size={14} /></div>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black text-gray-900">{excused.count}</p>
            <p className="text-[10px] font-bold text-blue-600">{excused.percentage}% Formal Leaves</p>
          </div>
        </div>
      </div>

      {/* DUAL DISPLAY RATIOS & GRAPH LOOK */}
      <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4">
        <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Users2 size={16} className="text-indigo-600" />
          Proportional Attendance Track Analysis
        </h4>

        {/* Compound Progress Bar Segment mapping status weights out of 100% */}
        <div className="w-full h-4 bg-gray-100 rounded-full flex overflow-hidden shadow-inner">
          <div style={{ width: `${present.percentage}%` }} className="h-full bg-emerald-500 transition-all duration-500" title={`Present: ${present.percentage}%`} />
          <div style={{ width: `${late.percentage}%` }} className="h-full bg-amber-400 transition-all duration-500" title={`Late: ${late.percentage}%`} />
          <div style={{ width: `${absent.percentage}%` }} className="h-full bg-red-500 transition-all duration-500" title={`Absent: ${absent.percentage}%`} />
          <div style={{ width: `${excused.percentage}%` }} className="h-full bg-blue-400 transition-all duration-500" title={`Excused: ${excused.percentage}%`} />
        </div>

        {/* Linear Legend Markers */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-[11px] font-semibold text-gray-500">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-emerald-500" /> Present ({present.count})</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-amber-400" /> Late ({late.count})</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-red-500" /> Absent ({absent.count})</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-blue-400" /> Excused ({excused.count})</div>
          <div className="ml-auto text-gray-400 font-medium">Total Tracked Instances: {totalLogs}</div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummaryReport;