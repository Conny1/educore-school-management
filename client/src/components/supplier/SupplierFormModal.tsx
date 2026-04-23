import React, { useEffect } from 'react'
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Modal } from "../Modal";
import { cn } from "../../lib/utils";
import {  useCreateSupplierMutation,  useUpdateSupplierMutation } from "../../features/apiSlice";
import { toast } from "react-toastify";
import { Supplier } from '@/types';
const supplierSchema = yup.object().shape({
  name: yup.string().required('Company name is required'),
  contactPerson: yup.string().required('Contact person is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  category: yup.string().required('Category is required'),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
});


type Props = {
  setEditingSupplier: React.Dispatch<React.SetStateAction<Supplier | null>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingSupplier: Supplier | null;
  isModalOpen: boolean;
};

const SupplierFormModal = ({setEditingSupplier, setIsModalOpen, editingSupplier, isModalOpen}:Props) => {
const [createSupplier, {isLoading:creating}] = useCreateSupplierMutation();
const [updateSupplier, {isLoading:updating}] = useUpdateSupplierMutation();

      const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(supplierSchema)
  });
  useEffect(() => {
    if (editingSupplier) {
      reset(editingSupplier);
    } else {
      reset({
         name: '',
         contactPerson: '',
         email: '',
         phone: '',
         category: 'General',
         status: 'active'
       });
    }
  }, [editingSupplier]);

    const onSubmit = async(data: Partial<Supplier>) => {
    if (editingSupplier) {
        const pro = await updateSupplier(data)
           if(pro.data?.success){
               toast.success("supplier updated");
           }else{
               toast.error("Failed. Try again")
           }
           
       } else {
           const newpro = await createSupplier(data)
           if(newpro.data?.success){
               toast.success("New supplier created");
           }else{
               toast.error("Failed. Try again")
           }
       }
       setIsModalOpen(false);
  };
  return (
    <div>
            {/* Supplier Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingSupplier ? "Edit Supplier Details" : "Register Vendor"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
           <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Company Name</label>
              <input {...register('name')} placeholder="e.g. Mshiriki Wholesalers" className={cn("w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm", errors.name ? "border-red-500" : "border-gray-200")} />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Contact Person</label>
                <input {...register('contactPerson')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Category</label>
                <input {...register('category')} placeholder="Stationery, Food, etc" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <input {...register('email')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Phone Number</label>
                <input {...register('phone')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
              </div>
           </div>

           <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Status</label>
              <select {...register('status')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
           </div>

           <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
             <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600">Cancel</button>
             <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700">Save Vendor</button>
           </div>
        </form>
      </Modal>
    </div>
  )
}

export default SupplierFormModal