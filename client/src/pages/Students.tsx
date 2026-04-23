import React, { useState } from 'react';
import { students as mockStudents, grades } from '../mock/data';
import { Student } from '../mock/types';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Search, Plus, Filter, Edit2, Eye, MoreHorizontal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { cn, formatDate } from '../lib/utils';

// Validation Schema
const studentSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  admissionNo: yup.string().required('Admission number is required'),
  gradeId: yup.string().required('Grade is required'),
  dob: yup.string().required('Date of birth is required'),
  gender: yup.string().oneOf(['male', 'female']).required('Gender is required'),
  guardianName: yup.string().required('Guardian name is required'),
  guardianPhone: yup.string()
    .matches(/^(07|01)\d{8}$/, 'Must be a valid Kenyan phone (10 digits starting with 07 or 01)')
    .required('Guardian phone is required'),
  status: yup.string().oneOf(['active', 'suspended', 'transferred', 'graduated']).required('Status is required'),
});

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(studentSchema),
    defaultValues: editingStudent || {
      status: 'active',
      gender: 'male',
    }
  });

  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingStudent(null);
    reset({
      firstName: '',
      lastName: '',
      admissionNo: `ADM/2025/${String(students.length + 1).padStart(3, '0')}`,
      gradeId: '',
      dob: '2018-01-01',
      gender: 'male',
      guardianName: '',
      guardianPhone: '',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    reset(student);
    setIsModalOpen(true);
  };

  const onSubmit = (data: any) => {
    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? { ...s, ...data } : s));
    } else {
      const newStudent = {
        ...data,
        id: `std-${Date.now()}`,
        enrolledAt: new Date().toISOString().split('T')[0]
      };
      setStudents([newStudent, ...students]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Students</h2>
          <p className="text-gray-500 text-sm">Manage all enrolled students in Mshiriki Academy.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          <Plus size={20} />
          Add New Student
        </button>
      </div>

      {/* Filters/Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or admission no..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
                <th className="px-6 py-4">Admission No</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Grade</th>
                <th className="px-6 py-4">Guardian</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.length > 0 ? filteredStudents.map((student) => {
                const grade = grades.find(g => g.id === student.gradeId);
                return (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 font-medium">{student.admissionNo}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{student.firstName} {student.lastName}</p>
                          <p className="text-[10px] text-gray-500 uppercase font-medium">{student.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-700">{grade?.name}</p>
                      <p className="text-[10px] text-gray-400">{grade?.stream}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 font-medium">{student.guardianName}</p>
                      <p className="text-xs text-gray-500">{student.guardianPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={student.status}>{student.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(student)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="View Profile">
                          <Eye size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all" title="More">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center">
            <p className="text-xs text-gray-500">Showing <b>{filteredStudents.length}</b> students</p>
            <div className="flex gap-2">
               <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600 disabled:opacity-50" disabled>Previous</button>
               <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600 disabled:opacity-50" disabled>Next</button>
            </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingStudent ? "Edit Student Details" : "Register New Student"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b pb-1">Personal Info</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">First Name</label>
                  <input 
                    {...register('firstName')}
                    className={cn("w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm", errors.firstName ? "border-red-500" : "border-gray-200")} 
                  />
                  {errors.firstName && <p className="text-red-500 text-[10px] font-bold">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Last Name</label>
                  <input 
                    {...register('lastName')}
                    className={cn("w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm", errors.lastName ? "border-red-500" : "border-gray-200")} 
                  />
                  {errors.lastName && <p className="text-red-500 text-[10px] font-bold">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Gender</label>
                  <select 
                    {...register('gender')}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Date of Birth</label>
                  <input 
                    type="date"
                    {...register('dob')}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" 
                  />
                  {errors.dob && <p className="text-red-500 text-[10px] font-bold">{errors.dob.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Admission No</label>
                <input 
                  {...register('admissionNo')}
                  readOnly={!!editingStudent}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-mono" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b pb-1">Academic & Contact</h4>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Grade / Class</label>
                <select 
                  {...register('gradeId')}
                  className={cn("w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm", errors.gradeId ? "border-red-500" : "border-gray-200")}
                >
                  <option value="">Select Grade</option>
                  {grades.map(g => <option key={g.id} value={g.id}>{g.name} - {g.stream}</option>)}
                </select>
                {errors.gradeId && <p className="text-red-500 text-[10px] font-bold">{errors.gradeId.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Guardian Name</label>
                <input 
                  {...register('guardianName')}
                  className={cn("w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm", errors.guardianName ? "border-red-500" : "border-gray-200")} 
                />
                {errors.guardianName && <p className="text-red-500 text-[10px] font-bold">{errors.guardianName.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Guardian Phone</label>
                <input 
                  placeholder="e.g. 0712345678"
                  {...register('guardianPhone')}
                  className={cn("w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm", errors.guardianPhone ? "border-red-500" : "border-gray-200")} 
                />
                {errors.guardianPhone && <p className="text-red-500 text-[10px] font-bold">{errors.guardianPhone.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Status</label>
                <select 
                  {...register('status')}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="transferred">Transferred</option>
                  <option value="graduated">Graduated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              {editingStudent ? "Update Student" : "Register Student"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Students;
