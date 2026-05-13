import { InventoryItem } from '@/types';
import React, { useEffect, useMemo } from 'react'
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Modal } from "../Modal";
import { cn } from "../../lib/utils";
import {  useCreateInventoryItemMutation,   useGetSuppliersQuery,  useUpdateInventoryItemMutation,   } from "../../features/apiSlice";
import { toast } from "react-toastify";
import { RefreshCw } from 'lucide-react';

const inventorySchema = yup.object().shape({
  name: yup.string().required('Item name is required'),
  category: yup.string().required('Category is required'),
  quantity: yup.number().min(0).required('Quantity is required'),
  reorderLevel: yup.number().min(0).required('Reorder level is required'),
  unitCost: yup.number().positive().required('Unit cost is required'),
  unit: yup.string().required('Unit is required'),
  supplierId: yup.string().required('Primary supplier is required'),
});
const categories = ['Stationery', 'General', 'Food', 'IT Equipment', 'Maintenance', 'Medical'];


type Props = {
  setEditingItem: React.Dispatch<React.SetStateAction<InventoryItem | null>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingItem: InventoryItem | null;
  isModalOpen: boolean;
};

const InventoryFormModal = ({setEditingItem, setIsModalOpen, editingItem, isModalOpen}:Props) => {

    const [createInventory, {isLoading:creating}] = useCreateInventoryItemMutation()
    const [updateInventory, {isLoading:updating}] = useUpdateInventoryItemMutation()
    const {data:suppliersResp} = useGetSuppliersQuery();
    const suppliers = useMemo(() => suppliersResp?.data || [], [suppliersResp?.data])
      const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(inventorySchema)
    
  });

    useEffect(() => {
      if (editingItem) {
        reset(editingItem);
      } else {
          reset({
             name: '',
             category: 'Stationery',
             quantity: 0,
             reorderLevel: 5,
             unitCost: 0,
             unit: 'pieces',
             supplierId: ''
           });
      }
    }, [editingItem]);

        const onSubmit = async(data: Partial<InventoryItem>) => {
        if (editingItem) {
            const inv = await updateInventory({...data,lastUpdated:new Date().toString()})
               if(inv.data?.success){
                   toast.success("inventory updated");
                   setEditingItem(null)
               }else{
                   toast.error("Failed. Try again")
               }
               
           } else {
               const newinv = await createInventory({...data,lastUpdated:new Date().toString()})
               if(newinv.data?.success){
                   toast.success("New inventory created");
               }else{
                   toast.error("Failed. Try again")
               }
           }
           setIsModalOpen(false);
      };

  return (
    <div>
      {/* Item Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Edit Inventory Item" : "New Inventory Log"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
           <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Item Name</label>
              <input 
                {...register('name')} 
                placeholder="e.g. Printing Paper (Reams)"
                className={cn("w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm", errors.name ? "border-red-500" : "border-gray-200")} 
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Category</label>
                <select {...register('category')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Primary Supplier</label>
                <select {...register('supplierId')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
                {errors.supplierId && <p className="text-red-500 text-[10px] font-bold">Supplier is required</p>}
              </div>
           </div>

           <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Stock Qty</label>
                <input type="number" {...register('quantity')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Min. Alert</label>
                <input type="number" {...register('reorderLevel')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Unit Type</label>
                <input {...register('unit')} placeholder="pcs, boxes" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
              </div>
           </div>

           <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Unit Cost (KES)</label>
              <input type="number" {...register('unitCost')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" />
              {errors.unitCost && <p className="text-red-500 text-xs">{errors.unitCost.message}</p>}
           </div>

           <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
             <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600">Cancel</button>
             <button disabled={updating || creating} type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center gap-2">
               <RefreshCw size={16} />
              {(updating || creating)?"Loading...":"Sync Inventory"} 
             </button>
           </div>
        </form>
      </Modal></div>
  )
}

export default InventoryFormModal