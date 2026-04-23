import React, { useState } from 'react';
import { employees as mockEmployees, departments, grades } from '../mock/data';
import { Employee } from '../mock/types';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Search, Plus, Filter, Edit2, Eye, Mail, Phone, Briefcase } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { cn, formatDate } from '../lib/utils';

// Validation Schema
const employeeSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  staffNo: yup.string().required('Staff number is required'),
  departmentId: yup.string().required('Department is required'),
  gradeId: yup.string().nullable(),
  role: yup.string().oneOf(['teacher', 'admin', 'support', 'management', 'finance']).required('Role is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string()
    .matches(/^(07|01)\d{8}$/, 'Valid Kenyan phone required')
    .required('Phone is required'),
  hireDate: yup.string().required('Hire date is required'),
  status: yup.string().oneOf(['active', 'inactive', 'on_leave']).required('Status is required'),
});

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: yupResolver(employeeSchema),
    defaultValues: editingEmployee || {
      status: 'active',
      role: 'teacher',
    }
  });

  const selectedRole = watch('role');

  const filteredEmployees = employees.filter(e => 
    `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.staffNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingEmployee(null);
    reset({
      firstName: '',
      lastName: '',
      staffNo: `STF/${String(employees.length + 1).padStart(3, '0')}`,
      departmentId: '',
      gradeId: null,
      role: 'teacher',
      email: '',
      phone: '',
      hireDate: new Date().toISOString().split('T')[0],
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    reset(employee);
    setIsModalOpen(true);
  };

  const onSubmit = (data: any) => {
    if (editingEmployee) {
      setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...e, ...data } : e));
    } else {
      const newEmployee = {
        ...data,
        id: `emp-${Date.now()}`
      };
      setEmployees([newEmployee, ...employees]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-slate-800">Staff & Employees</h2>
          <p className="text-gray-500 text-sm">Manage teaching and non-teaching staff members.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          Add Staff Member
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Staff</p>
            <p className="text-xl font-bold text-gray-900">{employees.length}</p>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active</p>
            <p className="text-xl font-bold text-emerald-600">{employees.filter(e => e.status === 'active').length}</p>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Teachers</p>
            <p className="text-xl font-bold text-indigo-600">{employees.filter(e => e.role === 'teacher').length}</p>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">On Leave</p>
            <p className="text-xl font-bold text-amber-600">{employees.filter(e => e.status === 'on_leave').length}</p>
         </div>
      </div>

      {/* Filters/Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, staff no, or role..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
                <th className="px-6 py-4">Staff No</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Role & Dept</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEmployees.map((employee) => {
                const dept = departments.find(d => d.id === employee.departmentId);
                const grade = grades.find(g => g.id === employee.gradeId);
                return (
                  <tr key={employee.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">{employee.staffNo}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs border border-white shadow-sm ring-1 ring-slate-200">
                          {employee.firstName[0]}{employee.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{employee.firstName} {employee.lastName}</p>
                          <p className="text-[10px] text-gray-400 font-medium">Joined {formatDate(employee.hireDate)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Mail size={12} className="text-gray-400" />
                          {employee.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Phone size={12} className="text-gray-400" />
                          {employee.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <Badge variant={employee.role} className="w-fit">{employee.role}</Badge>
                        <p className="text-[10px] text-gray-500 font-medium">{dept?.name}{employee.role === 'teacher' && grade ? ` (${grade.name})` : ''}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={employee.status}>{employee.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(employee)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingEmployee ? "Edit Staff Details" : "Onboard New Staff Member"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b pb-1">Primary Info</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">First Name</label>
                  <input {...register('firstName')} className={cn("w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm", errors.firstName ? "border-red-500" : "border-gray-200")} />
                  {errors.firstName && <p className="text-red-500 text-[10px] font-bold">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Last Name</label>
                  <input {...register('lastName')} className={cn("w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm", errors.lastName ? "border-red-500" : "border-gray-200")} />
                  {errors.lastName && <p className="text-red-500 text-[10px] font-bold">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Staff Number</label>
                <input {...register('staffNo')} className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-mono" readOnly={!!editingEmployee} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Role</label>
                  <select {...register('role')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                    <option value="finance">Finance</option>
                    <option value="management">Management</option>
                    <option value="support">Support</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Status</label>
                  <select {...register('status')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b pb-1">Department & Contact</h4>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Department</label>
                <select {...register('departmentId')} className={cn("w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm", errors.departmentId ? "border-red-500" : "border-gray-200")}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                {errors.departmentId && <p className="text-red-500 text-[10px] font-bold">{errors.departmentId.message}</p>}
              </div>

              {selectedRole === 'teacher' && (
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Assigned Grade (Class Teacher)</label>
                  <select {...register('gradeId')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                    <option value="">None</option>
                    {grades.map(g => <option key={g.id} value={g.id}>{g.name} - {g.stream}</option>)}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <input {...register('email')} className={cn("w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm", errors.email ? "border-red-500" : "border-gray-200")} />
                {errors.email && <p className="text-red-500 text-[10px] font-bold">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Phone Number</label>
                <input {...register('phone')} placeholder="e.g. 0711223344" className={cn("w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm", errors.phone ? "border-red-500" : "border-gray-200")} />
                {errors.phone && <p className="text-red-500 text-[10px] font-bold">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Hire Date</label>
                <input type="date" {...register('hireDate')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">{editingEmployee ? "Update Staff" : "Add Staff Member"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
