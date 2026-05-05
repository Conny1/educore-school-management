import React, { useMemo } from 'react';
import { 
  User, Phone, Calendar, Hash, MapPin, 
  Wallet, CheckCircle2, AlertCircle, PackageCheck, 
  History, TrendingUp, Info, 
  Search
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import { Badge } from '../components/Badge';
import { useParams } from 'react-router-dom';
import { useGetStudentByIdQuery, useGetStudentFinancialQuery } from '../features/apiSlice';
import { FullPageLoading } from '../components/shared/Loading';


const StudentProfile = () => {
  const params = useParams() as {id:string}
  const {data, isLoading:studentLoading} = useGetStudentByIdQuery(params.id )
  const {data:financial} = useGetStudentFinancialQuery(params.id)
  const student = useMemo(() => data?.data, [data?.data])

// Mock data

  const requirements = [
    { _id: "r1", itemName: "Exercise Books", requiredQty: 12, unit: "pcs", term: "Term 1", year: "2024" },
    { _id: "r2", itemName: "Reams of Paper", requiredQty: 2, unit: "reams", term: "Term 1", year: "2024" },
    { _id: "r3", itemName: "Pencils", requiredQty: 1, unit: "box", term: "Term 1", year: "2024" },
  ];

  const requirementLogs = [
    { requirementId: "r1", qtyBrought: 12 },
    { requirementId: "r2", qtyBrought: 1 },
  ];

  // --- LOGIC ---
  const termlyFinancials = useMemo(() => {
    return financial?.data || []
  }, [financial?.data]);

  const reqStatus = useMemo(() => {
    return requirements.map(req => {
      const brought = requirementLogs
        .filter(log => log.requirementId === req._id)
        .reduce((sum, log) => sum + log.qtyBrought, 0);
      return { ...req, brought, isComplete: brought >= req.requiredQty };
    });
  }, [requirements, requirementLogs]);




    if(studentLoading) return <FullPageLoading title="Loading student information"/>

if (!student) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-dashed border-gray-200">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4 animate-pulse">
        <Search size={40} />
      </div>
      <h3 className="text-xl font-bold text-gray-900">Student Not Found</h3>
      <p className="text-gray-500 max-w-xs mx-auto mt-2 text-sm">
        We couldn't find a student with that ID. They may have been deleted or moved to a different school.
      </p>
      <button 
        onClick={() => window.history.back()}
        className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all active:scale-95"
      >
        Go Back
      </button>
    </div>
  );
}

  return (
    
              <div className=" w-[700px]max-w-7xl mx-auto space-y-6 pb-12">
      {/* 1. Header & Personal Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4">
            <User size={48} />
          </div>
          <h2 className="text-2xl font-black text-gray-900">{student.firstName} {student.lastName}</h2>
          <p className="text-gray-400 font-medium mb-4">{student.admissionNo}</p>
          <Badge variant={student.status}>{student.status}</Badge>
          
          <div className="w-full mt-8 space-y-4 text-left border-t pt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><TrendingUp size={16}/></div>
              <div><p className="text-[10px] uppercase font-bold text-gray-400">Current Grade</p><p className="text-sm font-bold text-gray-700">{student.grade?.name}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><Phone size={16}/></div>
              <div><p className="text-[10px] uppercase font-bold text-gray-400">Guardian</p><p className="text-sm font-bold text-gray-700">{student.guardianName} ({student.guardianPhone})</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><Calendar size={16}/></div>
              <div><p className="text-[10px] uppercase font-bold text-gray-400">Enrolled On</p><p className="text-sm font-bold text-gray-700">{formatDate(student.enrolledAt)}</p></div>
            </div>
          </div>
        </div>

        {/* 2. Financial Overview */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Wallet className="text-indigo-600" size={24} />
              <h3 className="text-lg font-bold text-gray-900">Termly Fee Breakdown</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {termlyFinancials.map((term) => (
              <div key={term._id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{term.term} - {term.year}</span>
                  {term.balance <= 0 ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <AlertCircle size={18} className="text-orange-500" />
                  )}
                </div>
                <div className="flex justify-between">
                  <div><p className="text-[10px] text-gray-400 uppercase font-bold">Invoiced</p><p className="font-bold text-gray-700">{formatCurrency(term.amount)}</p></div>
                  <div className="text-right"><p className="text-[10px] text-gray-400 uppercase font-bold">Balance</p><p className={cn("font-black", term.balance > 0 ? "text-red-500" : "text-emerald-600")}>{formatCurrency(term.balance)}</p></div>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all" 
                    style={{ width: `${(term.paid / term.amount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Requirements Tracking */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <PackageCheck className="text-emerald-600" size={24} />
            <h3 className="text-lg font-bold text-gray-900">Stationery & Requirements</h3>
          </div>
          <p className="text-xs text-gray-400 font-medium">Tracking for Term 1, 2024</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                <th className="px-8 py-4">Requirement Item</th>
                <th className="px-8 py-4 text-center">Required Qty</th>
                <th className="px-8 py-4 text-center">Brought to Date</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reqStatus.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4 font-bold text-gray-700 text-sm">{req.itemName}</td>
                  <td className="px-8 py-4 text-center text-sm font-medium text-gray-500">{req.requiredQty} {req.unit}</td>
                  <td className="px-8 py-4 text-center text-sm font-black text-indigo-600">{req.brought} {req.unit}</td>
                  <td className="px-8 py-4">
                    {req.isComplete ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold uppercase">
                        <CheckCircle2 size={14} /> Full
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-orange-500 text-[10px] font-bold uppercase">
                        <Info size={14} /> Pending {req.requiredQty - req.brought}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-4 text-right text-xs text-gray-400 italic">
                    {req.brought === 0 ? "Not yet submitted" : "Verified by Admin"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  
  );
};

export default StudentProfile;