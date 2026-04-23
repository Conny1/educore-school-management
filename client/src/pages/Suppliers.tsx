import React, { useMemo, useState } from "react";
import { Badge } from "../components/Badge";
import { Search, Plus, Mail, Phone, User, Trash2 } from "lucide-react";
import SupplierFormModal from "../components/supplier/SupplierFormModal";
import {
  useDeleteSupplierMutation,
  useFindAndfilterSupplierQuery,
} from "../features/apiSlice";
import { findandfilter, pagination, Supplier } from "@/types";
import PaginationBtn from "../components/shared/Pagination";

const Suppliers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteSupplier, { isLoading: deleting }] = useDeleteSupplierMutation();

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
  const {
    data,
    refetch,
    isLoading: suppliersLoading,
  } = useFindAndfilterSupplierQuery(filters);
  const suppliers = useMemo(() => {
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
  const filterProvidedApps = (payload: findandfilter) => {
    setfilters(payload);
  };

  const handleAdd = () => {
    setEditingSupplier(null);

    setIsModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Registered Suppliers
          </h2>
          <p className="text-gray-500 text-sm">
            Manage vendor relationships and contact directory.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          Onboard Supplier
        </button>
      </div>

      {/* Top Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by company or contact person..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={searchTerm}
            onChange={(e) => {
              filterProvidedApps({
                ...filters,
                search: e.target.value,
              });
              setSearchTerm(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Grid View for Suppliers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers?.map((supplier) => (
          <div
            key={supplier._id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                  {supplier.name.charAt(0)}
                </div>
                <Badge variant={supplier.status}>{supplier.status}</Badge>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {supplier.name}
              </h3>
              <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold uppercase text-gray-500 tracking-wider">
                {supplier.category}
              </span>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <User size={16} className="text-gray-400" />
                  <span className="font-medium">{supplier.contactPerson}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  <span className="truncate">{supplier.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={16} className="text-gray-400" />
                  <span>{supplier.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 flex gap-2">
              <button
                onClick={() => handleEdit(supplier)}
                className="flex-1 py-2 bg-gray-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors uppercase tracking-widest border border-indigo-100"
              >
                Configure
              </button>
              <button
              disabled={deleting}
                onClick={async () => {
                  await deleteSupplier(supplier._id);
                }}
                className="p-2 text-red-300 hover:text-red-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <PaginationBtn
        paginationdata={paginationdata}
        setpaginationdata={setpaginationdata}
        refetch={nextPage}
      />
      <SupplierFormModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingSupplier={editingSupplier}
        setEditingSupplier={setEditingSupplier}
      />
    </div>
  );
};

export default Suppliers;
