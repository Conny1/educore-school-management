import React, { useState } from 'react';
import { 
  grades, 
  students, 
  payments, 
  gradeFees, 

  expenses,
  gradeRequirements,
  studentRequirementLogs
} from '../mock/data';
import { Badge } from '../components/Badge';
import { cn, formatCurrency } from '../lib/utils';
import { 
  PieChart, 
  BarChart, 
  TrendingUp, 
  Users, 
  Wallet, 
  Receipt, 
  Package, 
  Download
} from 'lucide-react';

const Reports: React.FC = () => {
  const [activeReport, setActiveReport] = useState<'fees' | 'attendance' | 'expenses' | 'requirements'>('fees');

  const getFeesReport = () => {
    return grades.map(grade => {
      const gradeStudents = students.filter(s => s.gradeId === grade.id);
      const studentCount = gradeStudents.length;
      
      const gradeFeeTotal = gradeFees.filter(f => f.gradeId === grade.id).reduce((a,c) => a + c.amount, 0);
      const expectedTotal = gradeFeeTotal * studentCount;
      
      const collectedTotal = payments.filter(p => {
        const student = students.find(s => s.id === p.studentId);
        return student?.gradeId === grade.id;
      }).reduce((a,c) => a + c.amount, 0);
      
      return {
        id: grade.id,
        name: grade.name,
        stream: grade.stream,
        studentCount,
        expected: expectedTotal,
        collected: collectedTotal,
        outstanding: expectedTotal - collectedTotal,
        rate: expectedTotal > 0 ? (collectedTotal / expectedTotal) * 100 : 0
      };
    });
  };

  const getExpensesByCategory = () => {
    const categories = ['Stationery', 'Food', 'Utilities', 'Maintenance', 'General', 'Transport', 'Wages'];
    return categories.map(cat => {
      const total = expenses.filter(e => e.category === cat).reduce((a,c) => a + c.amount, 0);
      return { category: cat, total };
    }).sort((a,b) => b.total - a.total);
  };

  const feesData = getFeesReport();
  const expensesData = getExpensesByCategory();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">School Reports</h2>
          <p className="text-gray-500 text-sm">Comprehensive analytics and financial summaries.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <Download size={18} />
          Download All Reports
        </button>
      </div>

      {/* Report Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1 bg-white border border-gray-100 rounded-2xl shadow-sm custom-scrollbar">
        {[
          { id: 'fees', label: 'Fee Collection', icon: Wallet },
          { id: 'attendance', label: 'Attendance', icon: Users },
          { id: 'expenses', label: 'Expenditures', icon: Receipt },
          { id: 'requirements', label: 'School Requirements', icon: Package },
        ].map(report => (
          <button
            key={report.id}
            onClick={() => setActiveReport(report.id as any)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              activeReport === report.id ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            )}
          >
            <report.icon size={18} />
            {report.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeReport === 'fees' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Expected</p>
                 <p className="text-2xl font-black text-gray-900">{formatCurrency(feesData.reduce((a,c) => a + c.expected, 0))}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-emerald-500">Global Collected</p>
                 <p className="text-2xl font-black text-emerald-600">{formatCurrency(feesData.reduce((a,c) => a + c.collected, 0))}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-red-500">Outstanding Balance</p>
                 <p className="text-2xl font-black text-red-600">{formatCurrency(feesData.reduce((a,c) => a + c.outstanding, 0))}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp size={18} className="text-indigo-600" />
                    Collection Rate by Grade
                  </h3>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                     <tr>
                       <th className="px-6 py-4">Grade & Stream</th>
                       <th className="px-6 py-4">Students</th>
                       <th className="px-6 py-4">Expected (KES)</th>
                       <th className="px-6 py-4">Collected (KES)</th>
                       <th className="px-6 py-4">Collection Rate</th>
                       <th className="px-6 py-4">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                     {feesData.map(row => (
                       <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                         <td className="px-6 py-4">
                           <p className="text-sm font-bold text-gray-900">{row.name}</p>
                           <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{row.stream}</p>
                         </td>
                         <td className="px-6 py-4 text-sm text-gray-600 font-medium">{row.studentCount}</td>
                         <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatCurrency(row.expected)}</td>
                         <td className="px-6 py-4 text-sm font-bold text-emerald-600">{formatCurrency(row.collected)}</td>
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                             <div className="flex-1 w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${row.rate}%` }} />
                             </div>
                             <span className="text-xs font-bold text-gray-700">{row.rate.toFixed(1)}%</span>
                           </div>
                         </td>
                         <td className="px-6 py-4">
                            <Badge variant={row.rate > 70 ? 'active' : row.rate > 40 ? 'pending' : 'absent'}>
                              {row.rate > 90 ? 'Ideal' : row.rate > 50 ? 'Developing' : 'Critical'}
                            </Badge>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {activeReport === 'attendance' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
             <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart size={40} />
             </div>
             <h3 className="text-xl font-bold text-gray-900">Attendance Trends Report</h3>
             <p className="text-gray-500 max-w-md mx-auto">Select a date range and grade to view detailed attendance fluctuations across the term.</p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grade</label>
                  <select className="w-48 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                    {grades.map(g => <option key={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Range</label>
                  <input type="month" className="w-48 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" defaultValue="2025-04" />
                </div>
             </div>
             <div className="pt-8">
                <div className="h-48 flex items-end justify-center gap-4">
                   {[65, 80, 45, 90, 85, 95, 75].map((h, i) => (
                     <div key={i} className="w-8 bg-indigo-500 rounded-t-lg transition-all hover:bg-indigo-600 group relative" style={{ height: `${h}%` }}>
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">{h}%</div>
                     </div>
                   ))}
                </div>
                <div className="flex justify-center gap-4 mt-2">
                   {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <span key={d} className="w-8 text-[10px] font-bold text-gray-400">{d}</span>)}
                </div>
             </div>
          </div>
        )}

        {activeReport === 'expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                   <PieChart size={18} className="text-indigo-600" />
                   Expenditure Breakdown
                </h3>
                <div className="space-y-4">
                  {expensesData.map(item => (
                    <div key={item.category} className="space-y-1.5">
                       <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-gray-700">{item.category}</span>
                          <span className="font-black text-gray-900">{formatCurrency(item.total)}</span>
                       </div>
                       <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500" 
                            style={{ width: `${(item.total / (expensesData[0]?.total || 1)) * 100}%` }} 
                          />
                       </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                   <h3 className="font-bold text-gray-900 mb-6">Financial Insights</h3>
                   <div className="space-y-6">
                      <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                            <TrendingUp size={20} />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-gray-900">Highest Category</p>
                            <p className="text-xs text-gray-500">Your school spends most on <b>{expensesData[0]?.category}</b> this term.</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Wallet size={20} />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-gray-900">Budget vs Actual</p>
                            <p className="text-xs text-gray-500">Expenses are currently <b>12% below</b> the seasonal forecast.</p>
                         </div>
                      </div>
                   </div>
                   <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-xs text-gray-500">
                      "Financial health is stable. We recommend reviewing the 'Utilities' consumption to further optimize operational costs."
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeReport === 'requirements' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
             <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Item Fulfillment Tracking</h3>
                <div className="flex gap-2">
                   <button className="p-1 px-3 text-[10px] font-bold uppercase tracking-widest bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">By Term</button>
                   <button className="p-1 px-3 text-[10px] font-bold uppercase tracking-widest bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">By Grade</button>
                </div>
             </div>
             <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grades.map(grade => {
                   const gradeReqs = gradeRequirements.filter(r => r.gradeId === grade.id);
                   const gradeStudents = students.filter(s => s.gradeId === grade.id);
                   
                   return (
                     <div key={grade.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/30 space-y-4">
                        <div className="flex justify-between items-center">
                           <h4 className="font-bold text-sm text-gray-900">{grade.name}</h4>
                           <span className="text-[10px] font-bold text-gray-400">{gradeStudents.length} Students</span>
                        </div>
                        <div className="space-y-3">
                           {gradeReqs.map(req => {
                              const totalBrought = studentRequirementLogs
                                .filter(l => l.requirementId === req.id)
                                .reduce((a,c) => a + c.qtyBrought, 0);
                              const totalExpected = req.requiredQty * gradeStudents.length;
                              const rate = totalExpected > 0 ? (totalBrought / totalExpected) * 100 : 0;
                              
                              return (
                                 <div key={req.id} className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                                       <span className="text-gray-500 truncate max-w-[120px]">{req.itemName}</span>
                                       <span className={cn(rate > 80 ? "text-emerald-600" : rate > 40 ? "text-amber-600" : "text-red-600")}>
                                          {rate.toFixed(0)}%
                                       </span>
                                    </div>
                                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                       <div className={cn("h-full transition-all", rate > 80 ? "bg-emerald-500" : rate > 40 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${rate}%` }} />
                                    </div>
                                 </div>
                              )
                           })}
                        </div>
                     </div>
                   )
                })}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
