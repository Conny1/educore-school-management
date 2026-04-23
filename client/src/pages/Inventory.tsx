import React, { useMemo, useState } from 'react';
import { Badge } from '../components/Badge';
import { Search, Plus,  AlertCircle, Package, Archive,  MoreVertical, Edit2 } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import InventoryFormModal from '../components/Inventory/InventoryFormModal';
import { findandfilter, InventoryItem, pagination } from '@/types';
import { useFindAndfilterInventoryItemQuery } from '../features/apiSlice';
import PaginationBtn from '../components/shared/Pagination';



const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);


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
  const { data,  isLoading:inventoryLoading } = useFindAndfilterInventoryItemQuery(filters);
  const inventories = useMemo(() => {
    if(data?.success){
      setpaginationdata({    page: data.data.page,
    limit: data.data.limit,
    totalPages: data.data.totalPages,
    totalResults: data.data.totalResults,})
    }
    return data?.data.results || []

  }, [data?.data])
  const nextPage = (page: number) => {
    setfilters((prev) => ({ ...prev, page }));
  };
    const filterInventory = (payload: findandfilter) => {
    setfilters(payload);
  };

  const lowStockCount = 30

  const handleAdd = () => {
    setEditingItem(null);
 
    setIsModalOpen(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

 

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory & Stores</h2>
          <p className="text-gray-500 text-sm">Manage school supplies, stationery, and equipment assets.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          New Inventory Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Archive size={24} />
           </div>
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total SKU Items</p>
              <p className="text-2xl font-black text-gray-900">{inventories.length}</p>
           </div>
        </div>
        
        <div className={cn(
          "p-6 rounded-2xl border shadow-md flex items-center gap-4 transition-all",
          lowStockCount > 0 ? "bg-amber-50 border-amber-200" : "bg-white border-gray-100 shadow-sm"
        )}>
           <div className={cn(
             "w-12 h-12 rounded-xl flex items-center justify-center",
             lowStockCount > 0 ? "bg-amber-100 text-amber-600" : "bg-gray-50 text-gray-400"
           )}>
              <AlertCircle size={24} />
           </div>
           <div>
              <p className={cn("text-[10px] font-bold uppercase tracking-widest", lowStockCount > 0 ? "text-amber-500" : "text-gray-400")}>Low Stock Alerts</p>
              <p className={cn("text-2xl font-black", lowStockCount > 0 ? "text-amber-700" : "text-gray-900")}>{lowStockCount} Items</p>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Package size={24} />
           </div>
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Value</p>
              <p className="text-2xl font-black text-emerald-700">{formatCurrency(300000)}</p>
           </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search items by name or category..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={searchTerm}
            onChange={(e) => {
                filterInventory({
                ...filters,
                search: e.target.value,
              });
              setSearchTerm(e.target.value)}}
          />
        </div>
        {/* <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600">
           <Filter size={18} />
           Filter Categories
        </button> */}
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-100">
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Unit Cost</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inventories?.map(item => {
                const isLow = item.quantity <= item.reorderLevel;
                const isCritical = item.quantity === 0;
                
                return (
                  <tr key={item._id} className={cn("transition-colors group", isLow ? (isCritical ? "bg-red-50/20" : "bg-amber-50/10") : "hover:bg-gray-50/30")}>
                    <td className="px-6 py-4">
                      <p className={cn("text-sm font-bold", isLow ? (isCritical ? "text-red-700 underline" : "text-amber-700") : "text-gray-900")}>
                        {item.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold uppercase text-gray-500 tracking-tight">{item.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={cn("text-sm font-bold", isLow ? "text-red-600" : "text-gray-700")}>{item.quantity} {item.unit}</span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Min: {item.reorderLevel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                      {formatCurrency(item.unitCost)}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {formatDate(item.lastUpdated)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isCritical ? (
                        <Badge variant="absent">Out of Stock</Badge>
                      ) : isLow ? (
                        <Badge variant="pending">Reorder</Badge>
                      ) : (
                        <Badge variant="active">Good</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 shadow-sm">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-all">
                          <MoreVertical size={14} />
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
        <PaginationBtn
              paginationdata={paginationdata}
              setpaginationdata={setpaginationdata}
              refetch={nextPage}
            />
<InventoryFormModal  isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} editingItem={editingItem} setEditingItem={setEditingItem}   />
    </div>
  );
};

export default Inventory;
