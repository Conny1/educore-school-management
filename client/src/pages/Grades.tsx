import React, { useState } from 'react';
import { grades as mockGrades, employees, students, gradeFees as mockFees, gradeRequirements as mockReqs } from '../mock/data';
import { Grade, GradeFee, GradeRequirement } from '../mock/types';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Plus, Edit2, ChevronRight, BookOpen, Wallet, Package, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { cn, formatCurrency } from '../lib/utils';

// Validation Schemas
const gradeSchema = yup.object().shape({
  name: yup.string().required('Grade name is required'),
  stream: yup.string().required('Stream name is required'),
  level: yup.string().required('Level is required'),
  classTeacherId: yup.string().nullable(),
});

const feeSchema = yup.object().shape({
  term: yup.string().oneOf(['Term 1', 'Term 2', 'Term 3']).required(),
  amount: yup.number().min(0, 'Amount must be positive').required(),
  description: yup.string().required(),
  year: yup.string().required(),
});

const reqSchema = yup.object().shape({
  itemName: yup.string().required(),
  requiredQty: yup.number().min(1).required(),
  unit: yup.string().required(),
});

const Grades: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>(mockGrades);
  const [fees, setFees] = useState<GradeFee[]>(mockFees);
  const [requirements, setRequirements] = useState<GradeRequirement[]>(mockReqs);
  
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeGrade, setActiveGrade] = useState<Grade | null>(null);
  const [detailTab, setDetailTab] = useState<'fees' | 'requirements'>('fees');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(gradeSchema)
  });

  const { register: registerFee, handleSubmit: handleSubmitFee, reset: resetFee } = useForm({
    resolver: yupResolver(feeSchema),
    defaultValues: { term: 'Term 2', year: '2025' }
  });

  const { register: registerReq, handleSubmit: handleSubmitReq, reset: resetReq } = useForm({
    resolver: yupResolver(reqSchema)
  });

  const handleAddGrade = () => {
    setActiveGrade(null);
    reset({ name: '', stream: '', level: 'Primary', classTeacherId: null });
    setIsGradeModalOpen(true);
  };

  const handleEditGrade = (grade: Grade) => {
    setActiveGrade(grade);
    reset(grade);
    setIsGradeModalOpen(true);
  };

  const onGradeSubmit = (data: any) => {
    if (activeGrade) {
      setGrades(grades.map(g => g.id === activeGrade.id ? { ...g, ...data } : g));
    } else {
      setGrades([...grades, { ...data, id: `grade-${Date.now()}` }]);
    }
    setIsGradeModalOpen(false);
  };

  const onFeeSubmit = (data: any) => {
    if (!activeGrade) return;
    const newFee: GradeFee = {
      ...data,
      id: `fee-${Date.now()}`,
      gradeId: activeGrade.id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFees([...fees, newFee]);
    resetFee();
  };

  const onReqSubmit = (data: any) => {
    if (!activeGrade) return;
    const newReq: GradeRequirement = {
      ...data,
      id: `req-${Date.now()}`,
      gradeId: activeGrade.id,
      term: 'Term 2',
      year: '2025',
      isActive: true
    };
    setRequirements([...requirements, newReq]);
    resetReq();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Grades & Streams</h2>
          <p className="text-gray-500 text-sm">Organize levels, streams, and manage requirements.</p>
        </div>
        <button 
          onClick={handleAddGrade}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
        >
          <Plus size={20} />
          Create New Grade
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grades.map((grade) => {
          const teacher = employees.find(e => e.id === grade.classTeacherId);
          const studentCount = students.filter(s => s.gradeId === grade.id).length;
          
          return (
            <div key={grade.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-lg">
                    {grade.name.match(/\d+/)?.[0] || 'G'}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditGrade(grade)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900">{grade.name}</h3>
                <p className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">{grade.stream} Stream</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <Plus size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Class Teacher</p>
                      <p className="text-sm font-semibold">{teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unassigned'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Plus size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Enrolled Students</p>
                      <p className="text-sm font-semibold">{studentCount} Students</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setActiveGrade(grade);
                  setIsDetailModalOpen(true);
                }}
                className="w-full py-4 bg-gray-50 border-t border-gray-100 text-xs font-bold text-indigo-600 hover:bg-indigo-50 flex items-center justify-center gap-2 transition-colors uppercase tracking-widest"
              >
                Manage Fees & Requirements
                <ChevronRight size={14} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Grade Form Modal */}
      <Modal 
        isOpen={isGradeModalOpen} 
        onClose={() => setIsGradeModalOpen(false)} 
        title={activeGrade ? "Edit Grade" : "Add New Grade"}
      >
        <form onSubmit={handleSubmit(onGradeSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Grade Name</label>
              <input 
                {...register('name')} 
                placeholder="e.g. Grade 1"
                className={cn("w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm", errors.name ? "border-red-500" : "border-gray-200")} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Stream</label>
              <input 
                {...register('stream')} 
                placeholder="e.g. North"
                className={cn("w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm", errors.stream ? "border-red-500" : "border-gray-200")} 
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Level</label>
            <select {...register('level')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
              <option value="Lower Primary">Lower Primary</option>
              <option value="Upper Primary">Upper Primary</option>
              <option value="Junior Secondary">Junior Secondary</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Class Teacher</label>
            <select {...register('classTeacherId')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
              <option value="">Select Teacher</option>
              {employees.filter(e => e.role === 'teacher').map(t => (
                <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
              ))}
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsGradeModalOpen(false)} className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold">Save Changes</button>
          </div>
        </form>
      </Modal>

      {/* Grade Details Modal (Fees & Requirements) */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`${activeGrade?.name} (${activeGrade?.stream}) Details`}
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex bg-gray-50 p-1 rounded-xl">
            <button 
              onClick={() => setDetailTab('fees')}
              className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2", detailTab === 'fees' ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700")}
            >
              <Wallet size={16} />
              Fees Management
            </button>
            <button 
              onClick={() => setDetailTab('requirements')}
              className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2", detailTab === 'requirements' ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700")}
            >
              <Package size={16} />
              Requirements List
            </button>
          </div>

          <div className="min-h-[300px]">
            {detailTab === 'fees' ? (
              <div className="space-y-6">
                {/* Add Fee Form */}
                <form onSubmit={handleSubmitFee(onFeeSubmit)} className="bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <select {...registerFee('term')} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm">
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                  <input {...registerFee('amount')} type="number" placeholder="Amount (KES)" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" />
                  <input {...registerFee('description')} placeholder="Description" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" />
                  <button type="submit" className="bg-indigo-600 text-white py-1.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                    <Plus size={16} /> Add Fee
                  </button>
                </form>

                {/* Fees List */}
                <div className="overflow-hidden border border-gray-100 rounded-xl">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Term</th>
                        <th className="px-4 py-3">Year</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {fees.filter(f => f.gradeId === activeGrade?.id).map(fee => (
                        <tr key={fee.id} className="text-sm">
                          <td className="px-4 py-3 font-semibold">{fee.term}</td>
                          <td className="px-4 py-3 text-gray-500">{fee.year}</td>
                          <td className="px-4 py-3 font-bold text-gray-900">{formatCurrency(fee.amount)}</td>
                          <td className="px-4 py-3 text-gray-500">{fee.description}</td>
                          <td className="px-4 py-3 text-right">
                             <button onClick={() => setFees(fees.filter(f => f.id !== fee.id))} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                               <Trash2 size={14} />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Add Requirement Form */}
                <form onSubmit={handleSubmitReq(onReqSubmit)} className="bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input {...registerReq('itemName')} placeholder="Item (e.g. Tissue)" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" />
                  <input {...registerReq('requiredQty')} type="number" placeholder="Qty" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" />
                  <input {...registerReq('unit')} placeholder="Unit (e.g. boxes)" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" />
                  <button type="submit" className="bg-indigo-600 text-white py-1.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                    <Plus size={16} /> Add Item
                  </button>
                </form>

                {/* Requirements List */}
                <div className="overflow-hidden border border-gray-100 rounded-xl">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Item Name</th>
                        <th className="px-4 py-3">Required Qty</th>
                        <th className="px-4 py-3">Term</th>
                        <th className="px-4 py-3 text-right" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {requirements.filter(r => r.gradeId === activeGrade?.id).map(req => (
                        <tr key={req.id} className="text-sm">
                          <td className="px-4 py-3 font-semibold">{req.itemName}</td>
                          <td className="px-4 py-3 text-gray-500">{req.requiredQty} {req.unit}</td>
                          <td className="px-4 py-3"><Badge variant="active">{req.term}</Badge></td>
                          <td className="px-4 py-3 text-right">
                             <button onClick={() => setRequirements(requirements.filter(r => r.id !== req.id))} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                               <Trash2 size={14} />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Grades;
