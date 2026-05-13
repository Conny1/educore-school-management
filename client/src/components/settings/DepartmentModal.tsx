import  { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Modal } from "../Modal";
import {  useCreateDepartmentsMutation, useUpdateDepartmentMutation } from "../../features/apiSlice";
import { toast } from "react-toastify";
import { Department } from "@/types";

const deptSchema = yup.object().shape({
  name: yup.string().required("Department name is required"),
  description: yup.string().optional(),
});

type DeptProps = {
  isOpen: boolean;
  onClose: () => void;
  editingDept: Department | null;
};

const DepartmentModal = ({ isOpen, onClose, editingDept }: DeptProps) => {
  const [createDept, { isLoading: creating }] = useCreateDepartmentsMutation();
  const [updateDept, { isLoading: updating }] = useUpdateDepartmentMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(deptSchema),
  });

  useEffect(() => {
    if (editingDept) {
      reset({ name: editingDept.name, description: editingDept.description });
    } else {
      reset({ name: "", description: "" });
    }
  }, [editingDept, reset, isOpen]);

  const onSubmit = async (data: Partial<Department>) => {
    const action = editingDept 
      ? updateDept({ _id: editingDept._id, ...data }) 
      : createDept(data);

    try {
      const resp = await action.unwrap();
      if (resp.success) {
        toast.success(`Department ${editingDept ? 'updated' : 'created'}`);
        onClose();
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingDept ? "Update Department" : "New Department"} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">Department Name</label>
          <input
            {...register("name")}
            placeholder="e.g. Science, Humanities, Finance"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors"
          />
          {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Briefly describe the department's role..."
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-bold text-gray-500">
            Cancel
          </button>
          <button
            disabled={creating || updating}
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            {creating || updating ? "Saving..." : editingDept ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DepartmentModal;