import React, { useMemo, useState } from 'react';
import { payments as mockPayments, students, grades, gradeFees } from '../mock/data';
import { Payment } from '../mock/types';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Search, Plus, Filter, Download, CreditCard, Smartphone, Banknote, Landmark, Wallet } from 'lucide-react';

import { cn, formatCurrency, formatDate } from '../lib/utils';
import { motion } from 'motion/react';
import PaymentFormModal from '../components/payments/PaymentFormModal';
import { findandfilter, pagination } from '@/types';
import { useFindAndfilterPaymentsQuery } from '../features/apiSlice';
import PaginationBtn from '../components/shared/Pagination';


const Payments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewSummaryId, setViewSummaryId] = useState<string | null>(null);


const [paginationdata, setpaginationdata] = useState<pagination>({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
  });

  const [filters, setfilters] = useState<findandfilter>({
    sortBy: "_id:-1",
    limit: paginationdata.limit,
    page: paginationdata.page,
    search: "",
    match_values: {},
  });
  const { data,  isLoading:paymentsLoading } = useFindAndfilterPaymentsQuery(filters);
  const payments = useMemo(() => {
    if(data?.success){
      setpaginationdata({    page: data.data.page,
    limit: data.data.limit,
    totalPages: data.data.totalPages,
    totalResults: data.data.totalResults,})
    }
    return data?.data.results || []

  }, [data?.data])
  const nextPage = (page: number) => {
    setfilters((prev) => ({ ...prev, page }));
  };
    const filterPayments = (payload: findandfilter) => {
    setfilters(payload);
  };
 

  const getStudentBalance = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return { owed: 0, paid: 0, balance: 0 };
    
    // Sum of all fees for this student's grade
    const studentFees = gradeFees.filter(f => f.gradeId === student.gradeId);
    const totalOwed = studentFees.reduce((acc, curr) => acc + curr.amount, 0);
    
    // Sum of all payments by this student
    const studentPayments = payments.filter(p => p.studentId === studentId);
    const totalPaid = studentPayments.reduce((acc, curr) => acc + curr.amount, 0);
    
    return { 
      owed: totalOwed, 
      paid: totalPaid, 
      balance: totalOwed - totalPaid,
      studentName: `${student.firstName} ${student.lastName}`,
      admissionNo: student.admissionNo,
      grade: grades.find(g => g.id === student.gradeId)?.name
    };
  };

  const summary = viewSummaryId ? getStudentBalance(viewSummaryId) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fee Payments</h2>
          <p className="text-gray-500 text-sm">Track all incoming revenue and fee collections.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all transition-colors">
            <Download size={18} />
            Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
          >
            <Plus size={20} />
            Record Payment
          </button>
        </div>
      </div>

      {/* Grid: Main Table & Quick Info */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={searchTerm}
                onChange={(e) => {
                    filterPayments({
                ...filters,
                search: e.target.value,
              });
              setSearchTerm(e.target.value)
                }}
              />
            </div>
            {/* <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              <Filter size={18} />
              All Methods
            </button> */}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
                    <th className="px-6 py-4">Receipt</th>
                    <th className="px-6 py-4">Student Info</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {payments?.map(payment => {
                    const student =payment.student;
                    const grade = payment.student?.grade;
                    return (
                      <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-600">{payment.receiptNo}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">{student?.firstName} {student?.lastName}</p>
                          <p className="text-[10px] text-gray-400">{grade?.name} • {student?.admissionNo}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-900">{formatCurrency(payment.amount)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={payment.method}>{payment.method.replace('_', ' ')}</Badge>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-500">{formatDate(payment.paidAt as string)}</td>
                        <td className="px-6 py-4 text-right">
                           <button 
                            onClick={() => setViewSummaryId(payment.studentId)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Student Balance"
                           >
                             <Search size={16} />
                           </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 bg-indigo-600 text-white">
               <h3 className="font-bold text-lg">Collection Summary</h3>
               <p className="text-indigo-100 text-xs mt-1">Current Academic Term</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                   <CreditCard size={20} />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expected Fees</p>
                   <p className="text-lg font-bold text-gray-900">{formatCurrency(360000)}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                   <Wallet size={20} />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Collected</p>
                   <p className="text-lg font-bold text-emerald-600">{formatCurrency(payments.reduce((a,c) => a+c.amount, 0))}</p>
                 </div>
              </div>
              <div className="pt-4 border-t border-gray-50">
                 <div className="flex justify-between items-center text-xs font-bold mb-2">
                   <span className="text-gray-400">Collection Rate</span>
                   <span className="text-emerald-600">62%</span>
                 </div>
                 <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[62%]" />
                 </div>
              </div>
            </div>
          </div>

          {/* Individual Balance Modal-Alternative */}
          {summary && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-lg shadow-emerald-50 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50" />
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                   <h3 className="font-bold text-gray-900">Student Balance</h3>
                   <button onClick={() => setViewSummaryId(null)} className="text-gray-300 hover:text-gray-500"><Plus size={16} className="rotate-45" /></button>
                </div>
                <div>
                   <p className="text-sm font-bold">{summary.studentName}</p>
                   <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{summary.admissionNo} • {summary.grade}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Total Fees</p>
                    <p className="text-sm font-bold">{formatCurrency(summary.owed)}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest text-opacity-70">Total Paid</p>
                    <p className="text-sm font-bold text-emerald-700">{formatCurrency(summary.paid)}</p>
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 text-center">
                   <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest opacity-80 mb-1">Outstanding Balance</p>
                   <p className="text-xl font-black text-orange-700">{formatCurrency(summary.balance)}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
            <PaginationBtn
              paginationdata={paginationdata}
              setpaginationdata={setpaginationdata}
              refetch={nextPage}
            />

      {/* Record Payment Modal */}
      <PaymentFormModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
  
    </div>
  );
};

export default Payments;
