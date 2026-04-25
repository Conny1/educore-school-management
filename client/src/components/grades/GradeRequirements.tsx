import React, { useMemo, useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Badge } from "../../components/Badge";
import { GradeRequirement } from "@/types";
import {
  useCreateGradeRequirementsMutation,
  useDeleteGradeRequirementsMutation,
  useGetGradesRequirementsQuery,
  useUpdateGradeRequirementsMutation,
} from "../../features/apiSlice";
import { toast } from "react-toastify";
import { Loading } from "../shared/Loading";

const reqSchema = yup.object().shape({
  itemName: yup.string().required(),
  requiredQty: yup.number().min(1).required(),
  unit: yup.string().required(),
  term: yup.string().oneOf(["Term 1", "Term 2", "Term 3"]).required(),
  year: yup.string().required(),
});

interface Props {
  gradeId: string;
}

const GradeRequirementsManager: React.FC<Props> = ({ gradeId }) => {
  const [editingReq, setEditingReq] = useState<GradeRequirement | null>(null);
  const { data: requirementsData } = useGetGradesRequirementsQuery(gradeId);
  const requirements = useMemo(
    () => requirementsData?.data || [],
    [requirementsData?.data],
  );
  const [createGraderequirements, { isLoading: creating }] =
    useCreateGradeRequirementsMutation();
  const [updateGraderequirements, { isLoading: updating }] =
    useUpdateGradeRequirementsMutation();
  const [deleteGraderequirements, { isLoading: deleting }] =
    useDeleteGradeRequirementsMutation();

  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(reqSchema),
    defaultValues: {
      term: "Term 1",
      year: new Date().getFullYear().toString(),
    },
  });

  const onSubmit = async (data: Partial<GradeRequirement>) => {
    const payload = {
      itemName: data.itemName,
      requiredQty: data.requiredQty,
      unit: data.unit,
      year: data.year,
      term: data.term,
    };
    if (editingReq) {
      const grd = await updateGraderequirements({ ...payload, _id: data._id });
      if (grd.data?.success) {
        toast.success("grade updated");
      } else {
        toast.error("Failed. Try again");
      }
    } else {
      const newgrd = await createGraderequirements({ ...payload, gradeId });
      if (newgrd.data?.success) {
        toast.success("New grade created");
      } else {
        toast.error("Failed. Try again");
      }
    }

    reset();
    setEditingReq(null);
  };

  const handleEdit = (req: GradeRequirement) => {
    setEditingReq(req);
    reset(req);
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <select
          {...register("term")}
          className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
        >
          <option value="Term 1">Term 1</option>
          <option value="Term 2">Term 2</option>
          <option value="Term 3">Term 3</option>
        </select>

        <select
          {...register("year")}
          className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
        >
          <option value={new Date().getFullYear()}>
            {new Date().getFullYear()}{" "}
          </option>
          <option value={new Date().getFullYear() + 1}>
            {new Date().getFullYear() + 1}{" "}
          </option>
        </select>
        <input
          {...register("itemName")}
          placeholder="Item"
          className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
        />
        <input
          {...register("requiredQty")}
          type="number"
          placeholder="Qty"
          className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
        />
        <input
          {...register("unit")}
          placeholder="Unit eg pieces, Kgs"
          className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
        />

        <button disabled={ updating || creating } className="bg-indigo-600 text-white py-1.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
          <Plus size={16} />
                   { (updating || creating)?<Loading size="sm" />  : editingReq ? "Update" : "Add Item"}
        </button>
      </form>

      {/* List */}
      <div className="overflow-hidden border border-gray-100 rounded-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            <tr>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Term</th>
              <th className="px-4 py-3">Item Name</th>
              <th className="px-4 py-3">Required Qty</th>
              <th className="px-4 py-3 text-right" />
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {requirements.map((req) => (
              <tr key={req._id} className="text-sm">
                <td className="px-4 py-3 font-semibold">{req.year}</td>
                <td className="px-4 py-3">
                  <Badge variant="active">{req.term}</Badge>
                </td>{" "}
                <td className="px-4 py-3 font-semibold">{req.itemName}</td>
                <td className="px-4 py-3 text-gray-500">
                  {req.requiredQty} {req.unit}
                </td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  {/* EDIT */}
                  <button
                    onClick={() => handleEdit(req)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                  >
                    <Edit2 size={14} />
                  </button>

                  {/* DELETE */}
                  <button
                    disabled={deleting}
                    onClick={async () => await deleteGraderequirements(req._id)}
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"
                  >
                    {deleting ? <Loading size="sm" /> : <Trash2 size={14} />}
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

export default GradeRequirementsManager;
