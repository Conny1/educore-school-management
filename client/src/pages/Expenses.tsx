import React, { useMemo, useState } from "react";
import { Badge } from "../components/Badge";
import { Plus, Receipt, Trash2, Edit2 } from "lucide-react";

import { cn, formatCurrency, formatDate } from "../lib/utils";
import ExpenseFormModal from "../components/expense/ExpenseFormModal";
import { Expense, findandfilter, pagination } from "@/types";
import {
  useDeleteExpenseMutation,
  useFindAndfilterExpenseQuery,
} from "../features/apiSlice";
import PaginationBtn from "../components/shared/Pagination";

const categories = [
  "Stationery",
  "Food",
  "Utilities",
  "Maintenance",
  "General",
  "Transport",
  "Wages",
];

const Expenses: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteExpense, { isLoading: deleting }] = useDeleteExpenseMutation();

  const [paginationdata, setpaginationdata] = useState<pagination>({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0,
  });

  const [filters, setfilters] = useState<findandfilter>({
    sortBy: "_id:-1",
    limit: paginationdata.limit,
    page: paginationdata.page,
    search: "",
    match_values: {},
  });
  const { data, isLoading: expenseLoading } =
    useFindAndfilterExpenseQuery(filters);
  const expenses = useMemo(() => {
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
  const filterExpenses = (payload: findandfilter) => {
    setfilters(payload);
  };

  const totalSpent = 400000;

  const handleAdd = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Expenses Tracking
          </h2>
          <p className="text-gray-500 text-sm">
            Monitor school expenditures and cash outflows.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-100"
        >
          <Plus size={20} />
          Record Expense
        </button>
      </div>

      {/* Aggregate */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Quick Filter
          </h4>
          <div className="flex flex-wrap gap-2">
            {["All", ...categories.slice(0, 5)].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  let payload = { ...filters };
                  if (cat === "All") {
                    payload.match_values = {};
                  } else {
                    payload.match_values = { category: cat };
                  }
                  filterExpenses(payload);
                  setCategoryFilter(cat);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                  categoryFilter === cat
                    ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-50"
                    : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-100">
                <th className="px-6 py-4">Receipt No</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {expenses?.map((expense) => {
                const supplier = { name: "Needs to be implemented" };
                return (
                  <tr
                    key={expense._id}
                    className="hover:bg-gray-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-[11px] font-bold text-gray-500 uppercase">
                      {expense.receiptNo}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 leading-tight">
                        {expense.description}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {supplier ? supplier.name : "Out-of-pocket"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold uppercase text-gray-600 tracking-tight">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-gray-900">
                        {formatCurrency(expense.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={expense.status}>{expense.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-500 whitespace-nowrap">
                      {formatDate(expense.expenseDate)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 shadow-sm"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          disabled={deleting}
                          onClick={async () => {
                            await deleteExpense(expense._id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
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
      {/* Record Expense Modal */}

      <ExpenseFormModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingExpense={editingExpense}
        setEditingExpense={setEditingExpense}
      />
    </div>
  );
};

export default Expenses;
