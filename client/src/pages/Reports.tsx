import React, { useState } from 'react';
import { 
  grades, 
  students, 
  payments, 
  gradeFees, 

  expenses,
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
import SchoolRequirementsReport from '../components/Reports/SchoolRequirementsReport';
import ExpenseBreakdownReport from '../components/Reports/ExpenseBreakdownReport';
import AttendanceSummaryReport from '../components/Reports/AttendanceSummaryReport';
import FeeCollectionReport from '../components/Reports/FeeCollectionReport';

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
       <FeeCollectionReport/>
        )}

        {activeReport === 'attendance' && (
       <AttendanceSummaryReport/>
        )}

        {activeReport === 'expenses' && (
      <ExpenseBreakdownReport/>
        )}

        {activeReport === 'requirements' && (
          <SchoolRequirementsReport/>
        )}
      </div>
    </div>
  );
};

export default Reports;
