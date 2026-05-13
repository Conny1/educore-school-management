import React, { useMemo, useState } from "react";
import { Plus, Trash2,  } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { formatCurrency } from "../../lib/utils";
import { GradeFee } from "@/types";
import { useCreateGradeFeeMutation, useDeleteGradeFeeMutation, useGetGradesFeeQuery, useUpdateGradeFeeMutation } from "../../features/apiSlice";
import { toast } from "react-toastify";
import { Loading } from "../shared/Loading";

const feeSchema = yup.object().shape({
  term: yup.string().oneOf(["Term 1", "Term 2", "Term 3"]).required(),
  amount: yup.number().min(0).required(),
  description: yup.string().required(),
  year: yup.string().required(),
});
interface Props {

  gradeId: string;
}


const GradeFeesManager: React.FC<Props> = ({gradeId}) => {
  const [editingFee, setEditingFee] = useState<GradeFee | null>(null);
  const {data:feesData} = useGetGradesFeeQuery(gradeId)
  const fees = useMemo(() => feesData?.data || [], [feesData?.data])
  const [createGradeFees, {isLoading:creating}] = useCreateGradeFeeMutation()
  const [updateGradeFees, {isLoading:updating}] = useUpdateGradeFeeMutation()
  const [deleteGradefee, {isLoading:deleting}] = useDeleteGradeFeeMutation()

  const {
    register,
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(feeSchema),
    defaultValues: { term: "Term 1", year:new Date().getFullYear().toString()  },
  });

  const onSubmit = async (data: Partial<GradeFee>) => {

    let payload = {
        term:data.term,
        amount:data.amount,
        year:data.year,
        description:data.description,

    }
    if (editingFee) {
       const grd = await updateGradeFees({ ...payload, _id: data._id });
         if (grd.data?.success) {
           toast.success("grade fee updated");
         } else {
           toast.error("Failed. Try again");
         }
    } else {
           const newgrd = await createGradeFees({...payload, gradeId});
              if (newgrd.data?.success) {
                toast.success("New grade fee added");
               
              } else {
                toast.error("Failed. Try again");
              }
    
      };

    reset();
    setEditingFee(null);
    }

  

  return (
    <div className="space-y-6">
      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <select {...register("term")} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm">
          <option value="Term 1">Term 1</option>
          <option value="Term 2">Term 2</option>
          <option value="Term 3">Term 3</option>
        </select>

          <select {...register("year")} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm">
            
          <option value= {new Date().getFullYear()}  >{new Date().getFullYear()} </option>
          <option value={new Date().getFullYear() + 1} >{new Date().getFullYear()+ 1} </option>
        </select>


        <input {...register("amount")} type="number" placeholder="Amount (KES)" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" />
       
        <input {...register("description")} placeholder="Description" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" />

        <button disabled={creating || updating} type="submit" className="bg-indigo-600 text-white py-1.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
          <Plus size={16} />
          { (updating || creating)?<Loading size="sm" /> :  editingFee ? "Update" : "Add Fee"}
        </button>
      </form>

      {/* List */}
      <div className="overflow-hidden border border-gray-100 rounded-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            <tr>
              <th className="px-4 py-3">Term</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {fees.map(fee => (
              <tr key={fee._id} className="text-sm">
                <td className="px-4 py-3 font-semibold">{fee.term}</td>
                <td className="px-4 py-3 text-gray-500">{fee.year}</td>
                <td className="px-4 py-3 font-bold">{formatCurrency(fee.amount)}</td>
                <td className="px-4 py-3 text-gray-500">{fee.description}</td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  
              

                  {/* DELETE */}
                  <button
                  disabled={deleting}
                    onClick={async() => {
                        await deleteGradefee(fee._id)
                    }}
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"
                  >
                    {!deleting?<Trash2 size={14} />: <Loading size="sm" />}
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeFeesManager;