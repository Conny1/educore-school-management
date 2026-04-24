import React, { useMemo, useState } from 'react';
import { Badge } from '../components/Badge';
import { Search, Plus, Filter, Edit2, Eye, Mail, Phone, Briefcase } from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import EmployeeFormModal from '../components/employees/EmployeeFormModal';
import { Employee, findandfilter, pagination } from '@/types';
import { useFindAndfilterEmployeesQuery } from '../features/apiSlice';
import PaginationBtn from '../components/shared/Pagination';


const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);


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
  const { data, isLoading: inventoryLoading } =
    useFindAndfilterEmployeesQuery(filters);
  const employees = useMemo(() => {
    if (data?.success) {
      setpaginationdata({
        page: data.data.page,
        limit: data.data.limit,
        totalPages: data.data.totalPages,
        totalResults: data.data.totalResults,
      });
    }
    return data?.data.results || [];
  }, [data?.data]);
  const nextPage = (page: number) => {
    setfilters((prev) => ({ ...prev, page }));
  };
  const filterEmployees = (payload: findandfilter) => {
    setfilters(payload);
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff & Employees</h2>
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
            onChange={(e) => {
               filterEmployees({
                ...filters,
                search: e.target.value,
              });
              setSearchTerm(e.target.value);
            }}
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
              {employees.map((employee) => {
                const dept = employee.department
                const grade = employee.grade
                return (
                  <tr key={employee._id} className="hover:bg-gray-50/50 transition-colors group">
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
                        <p className="text-[10px] text-gray-500 font-medium">{dept?.name}{employee.role === 'teacher' && grade && grade?.name ? ` (${grade.name})` : ''}</p>
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
             <PaginationBtn
                paginationdata={paginationdata}
                setpaginationdata={setpaginationdata}
                refetch={nextPage}
              />
      </div>

      {/* Add/Edit Modal */}
   <EmployeeFormModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} editingEmployee={editingEmployee} setEditingEmployee={setEditingEmployee}   />
    </div>
  );
};

export default Employees;
