import React, { useMemo, useState } from 'react';
import { Building2, Plus, Edit3, Trash2, Search } from 'lucide-react';
import { useGetDepartmentsQuery, useDeleteDepartmentMutation } from '../../features/apiSlice';
import { toast } from 'react-toastify';
import { Department } from '@/types';
import DepartmentModal from './DepartmentModal';

const DepartmentSettings = () => {
  const { data: deptData, isLoading } = useGetDepartmentsQuery();
  const [deleteDept] = useDeleteDepartmentMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const departments = useMemo(() => deptData?.data || [], [deptData?.data ])

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDept(id).unwrap();
        toast.success("Department removed");
      } catch (err) {
        toast.error("Failed to delete department");
      }
    }
  };


  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
        <div className="relative w-full md:w-72">
         
        </div>
        <button
          onClick={() => { setEditingDept(null); setIsModalOpen(true); }}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
        >
          <Plus size={18} /> Add Department
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          [1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-50 animate-pulse rounded-2xl" />)
        ) : departments.map((dept: any) => (
          <div key={dept._id} className="group p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-md hover:border-indigo-100 transition-all flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                <Building2 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{dept.name}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{dept.description || 'No description provided.'}</p>
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(dept)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Edit3 size={16} />
              </button>
              <button onClick={() => handleDelete(dept._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <DepartmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editingDept={editingDept} 
      />
    </div>
  );
};

export default DepartmentSettings;