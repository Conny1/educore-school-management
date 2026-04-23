import React, { useEffect, useMemo } from 'react'
import * as yup from 'yup';
import { cn, formatCurrency, formatDate, generateRandomId } from '../../lib/utils';
import { Expense } from '@/types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal } from '../Modal';
import { Calendar, Tag } from 'lucide-react';
import { useCreateExpenseMutation, useGetSuppliersQuery, useUpdateExpenseMutation } from '../../features/apiSlice';
import { toast } from 'react-toastify';



const expenseSchema = yup.object().shape({
  description: yup.string().required('Description is required'),
  category: yup.string().required('Category is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  expenseDate: yup.string().required('Date is required'),
  receiptNo: yup.string().required('Receipt number is required'),
  supplierId: yup.string().nullable(),
  status: yup.string().oneOf(['pending', 'approved', 'paid']).required('Status is required'),
});

type Props = {
  setEditingExpense: React.Dispatch<React.SetStateAction<Expense | null>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingExpense: Expense | null;
  isModalOpen: boolean;
};
const categories = ['Stationery', 'Food', 'Utilities', 'Maintenance', 'General', 'Transport', 'Wages'];

const ExpenseFormModal = ({setEditingExpense, setIsModalOpen, isModalOpen, editingExpense}:Props) => {

    const {data:supplierData} = useGetSuppliersQuery();
    const suppliers = useMemo(() => supplierData?.data || [], [supplierData?.data])
    const [updateExpense, {isLoading:loading}] = useUpdateExpenseMutation()
    const [createExpense, {isLoading:creating}] = useCreateExpenseMutation()

      const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(expenseSchema)
  });


      useEffect(() => {
        if (editingExpense) {
          reset(editingExpense);
        } else {
        reset({
              description: '',
              category: 'General',
              amount: 0,
              expenseDate: new Date().toISOString().split('T')[0],
              receiptNo: generateRandomId("EXP"),
              status: 'pending',
              supplierId:null
            });
        }
      }, [editingExpense]);
  

   const onSubmit = async (data: any) => {
    if (editingExpense) {
    const inv = await updateExpense(data)
                 if(inv.data?.success){
                     toast.success("inventory updated");
                 }else{
                     toast.error("Failed. Try again")
                 }
                 
             } else {
                 const newinv = await createExpense(data)
                 if(newinv.data?.success){
                     toast.success("New inventory created");
                      reset({
              description: '',
              category: 'General',
              amount: 0,
              expenseDate: new Date().toISOString().split('T')[0],
              receiptNo: generateRandomId("EXP"),
              status: 'pending',
              supplierId:null
            });
                 }else{
                     toast.error("Failed. Try again")
                 }
             }
             setIsModalOpen(false);
  };

  return (
    <div>
       <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingExpense ? "Update Expense Record" : "New Expenditure Entry"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
           <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Expense Description</label>
              <textarea 
                {...register('description')} 
                rows={2}
                placeholder="What was this expense for?"
                className={cn("w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm", errors.description ? "border-red-500" : "border-gray-200")} 
              />
              {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                  <Tag size={14} className="text-gray-400" /> Category
                </label>
                <select {...register('category')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Amount (KES)</label>
                <input type="number" {...register('amount')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-red-600" />
                {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                  <Calendar size={14} className="text-gray-400" /> Expense Date
                </label>
                <input type="date" {...register('expenseDate')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Receipt / Voucher No.</label>
                <input {...register('receiptNo')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono" />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Vendor / Supplier</label>
                <select {...register('supplierId')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                  <option value="">None (Personal/Misc)</option>
                  {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Approval Status</label>
                <select {...register('status')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
           </div>


           <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
             <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600">Cancel</button>
             <button type="submit" className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-100">Save Expense</button>
           </div>
        </form>
      </Modal>
      </div>
  )
}

export default ExpenseFormModal