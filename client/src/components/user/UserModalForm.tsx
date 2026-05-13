import  { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Modal } from "../Modal";
import { useCreateUserMutation, useUpdateUserMutation, useGetEmployeesQuery } from "../../features/apiSlice";
import { toast } from "react-toastify";
import { Key, Mail, Shield, User as UserIcon } from "lucide-react";
import { User } from "@/types";

const userSchema = yup.object().shape({
  employeeId: yup.string().required("Please select an employee"),
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().when('$isEdit', {
    is: false,
    then: (schema) => schema.min(6, "Password must be at least 6 characters").required("Password is required"),
    otherwise: (schema) => schema.nullable().notRequired()
  }),
  role: yup.string().oneOf(["admin", "teacher", "finance", "management", "superadmin"]).required("Role is required"),
});

type Props ={
   isOpen:boolean;
    onClose:()=>void;
    editingUser:User | null;
}
const UserModal = ({ isOpen, onClose, editingUser }:Props) => {
  const { data: empData } = useGetEmployeesQuery();
  const employees = useMemo(() => empData?.data || [], [empData]);

  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(userSchema),
    context: { isEdit: !!editingUser }
  });

  useEffect(() => {
    if (editingUser) {
      reset({
        employeeId: editingUser.employeeId,
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        password: "" // Don't populate password for security
      });
    } else {
      reset({ employeeId: "", name: "", email: "", role: "teacher", password: "" });
    }
  }, [editingUser, reset, isOpen]);

  const onSubmit = async (data: Partial<User>) => {
    try {
      const payload = editingUser ? { _id: editingUser._id, ...data } : data;
      if (editingUser && !data.password) delete payload.password;

      const resp = await (editingUser ? updateUser(payload) : createUser(payload)).unwrap();
      if (resp.success) {
        toast.success(`User access ${editingUser ? 'updated' : 'granted'}`);
        onClose();
      }
    } catch (err) {
      toast.error( "Operation failed");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingUser ? "Edit User Access" : "Create System User"} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">Link to Employee</label>
          <select
            {...register("employeeId", {
              onChange: (e) => {
                const emp = employees.find((item) => item._id === e.target.value);
                if (emp) {
                  setValue("name", `${emp.firstName} ${emp.lastName}`);
                  setValue("email", emp.email || "");
                }
              }
            })}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
          >
            <option value="">Select Employee...</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName}</option>
            ))}
          </select>
          {errors.employeeId && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.employeeId.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">Display Name</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input {...register("name")} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input {...register("email")} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium" />
            </div>
            {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">System Role</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <select {...register("role")} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold">
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="finance">Finance</option>
                <option value="management">Management</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">Password {editingUser && "(Leave blank to keep current)"}</label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input type="password" {...register("password")} placeholder="••••••••" className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
          </div>
          {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.password.message}</p>}
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-bold text-gray-500">Cancel</button>
          <button disabled={creating || updating} type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100">
            {creating || updating ? "Saving..." : editingUser ? "Update Access" : "Grant Access"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;