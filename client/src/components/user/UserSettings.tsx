import  { useMemo, useState } from 'react';
import {  UserPlus, Edit3, Trash2,   } from 'lucide-react';
import { useGetUsersQuery, useDeleteUserMutation } from '../../features/apiSlice';
import { toast } from 'react-toastify';
import UserModal from './UserModalForm';
import { cn } from '../../lib/utils';
import { User } from '@/types';

const UserSettings = () => {
  const { data: userData, isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const users = useMemo(() => userData?.data || [], [userData?.data ])

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-50 text-red-600 border-red-100';
      case 'teacher': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'finance': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Revoke system access for this user?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("User access revoked");
      } catch (err) {
        toast.error("Failed to delete user");
      }
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
        <div className="relative w-full md:w-72">
        
        </div>
        <button
          onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
        >
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          [1, 2].map(i => <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-2xl" />)
        ) : users.filter(item=>item.role !=="superadmin").map((user: any) => (
          <div key={user._id} className="group p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border font-bold text-xs uppercase", getRoleStyle(user.role))}>
                {user.name.substring(0, 2)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                  {user.name}
                  <span className={cn("text-[9px] px-2 py-0.5 rounded-full border uppercase tracking-tighter", getRoleStyle(user.role))}>
                    {user.role}
                  </span>
                </h4>
                <p className="text-[11px] text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditingUser(user); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Edit3 size={16} />
              </button>
              <button onClick={() => handleDelete(user._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editingUser={editingUser} 
      />
    </div>
  );
};

export default UserSettings;