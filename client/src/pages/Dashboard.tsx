import React, { useMemo } from 'react';
import { 
  BarChart3, 
  Users, 
  Briefcase, 
  Wallet, 
  Receipt, 
  AlertTriangle, 
  TrendingUp,
  Clock,
  School as LucideSchool
} from 'lucide-react';
import { 
  students, 
  employees, 
  payments, 
  expenses, 
  inventoryItems, 
  studentAttendance, 
  employeeAttendance 
} from '../mock/data';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import { useGetauthuserQuery } from '../features/apiSlice';
import { useDispatch } from 'react-redux';
import { updateUserData } from '../features/user/userSlice';

const Dashboard: React.FC = () => {
    const { data: authUser } = useGetauthuserQuery();
  const dispatch = useDispatch()
   useMemo(() => {
      if (authUser?.data) {
        dispatch(updateUserData(authUser?.data));
      }
      return authUser?.data
    }, [authUser?.data]);
  // Aggregate data
  const totalStudents = students.length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  
  const currentTermPayments = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const currentTermExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.reorderLevel);
  const recentPayments = [...payments].sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()).slice(0, 5);

  const todayStr = '2025-04-18'; // Mock today
  const studentAttToday = studentAttendance.filter(a => a.date === todayStr);
  const studentPresent = studentAttToday.filter(a => a.status === 'present').length;
  
  const employeeAttToday = employeeAttendance.filter(a => a.date === todayStr);
  const employeePresent = employeeAttToday.filter(a => a.status === 'present').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Total Students" 
          value={totalStudents} 
          icon={Users} 
          trend={{ value: 12, isUp: true }}
          color="primary"
        />
        <StatCard 
          title="Staff Count" 
          value={activeEmployees} 
          icon={Briefcase} 
          description="Active duty"
          color="secondary"
        />
        <StatCard 
          title="Fee Collection" 
          value={formatCurrency(currentTermPayments).replace('KES ', 'KES ')} 
          icon={Wallet} 
          trend={{ value: 78, isUp: true }} // Just using 78 for matching the theme look
          description="78% of target"
          color="success"
        />
        <StatCard 
          title="Term Expenses" 
          value={formatCurrency(currentTermExpenses).replace('KES ', 'KES ')} 
          trend={{ value: 0, isUp: true }}
          description="Within budget"
          icon={Receipt} 
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Recent Payments */}
        <div className="lg:col-span-2 sms-card flex flex-col">
          <div className="sms-card-header">
            <h2 className="sms-card-title">Recent Fee Payments</h2>
            <button className="text-[0.75rem] bg-none border-none text-primary font-bold cursor-pointer">View All</button>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Receipt</th>
                  <th>Student</th>
                  <th>Grade</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th className="text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => {
                  const student = students.find(s => s.id === payment.studentId);
                  return (
                    <tr key={payment.id}>
                      <td className="font-mono text-[0.8rem]">#{payment.receiptNo.replace('RCP/', 'RCP-')}</td>
                      <td>{student?.firstName} {student?.lastName}</td>
                      <td>Grade 4 North</td>
                      <td className="font-bold">{formatCurrency(payment.amount)}</td>
                      <td>
                        <Badge variant={payment.method}>{payment.method === 'bank_transfer' ? 'BANK' : payment.method.toUpperCase()}</Badge>
                      </td>
                      <td className="text-right text-text-muted">{formatDate(payment.paidAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Inventory Alerts */}
          <div className="sms-card">
            <div className="sms-card-header">
              <h2 className="sms-card-title">Inventory Alerts</h2>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {lowStockItems.length > 0 ? lowStockItems.slice(0, 3).map(item => (
                <div key={item.id} className="px-5 py-3 flex justify-between items-center">
                  <span className="text-[0.875rem] font-medium text-text-main">{item.name}</span>
                  <span className="text-[0.8125rem] text-danger font-bold">{item.quantity} {item.unit} Left</span>
                </div>
              )) : (
                <div className="px-5 py-4 text-sm text-text-muted italic">All stock levels are optimal.</div>
              )}
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="sms-card">
            <div className="sms-card-header">
              <h2 className="sms-card-title">Today's Attendance</h2>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[0.8125rem] font-medium">
                  <span>Students</span>
                  <span className="font-bold">94%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="bg-[#10b981] h-full transition-all duration-1000" style={{ width: '94%' }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[0.8125rem] font-medium">
                  <span>Employees</span>
                  <span className="font-bold">100%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="bg-[#10b981] h-full transition-all duration-1000" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="mt-2 text-[0.75rem] text-text-muted leading-relaxed">
                <strong>Note:</strong> 28 students marked absent today. Primary reason recorded: Seasonal Flu.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal icon for the quick action card
function SchoolIcon({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export default Dashboard;
