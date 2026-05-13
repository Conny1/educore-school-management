import { Project } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Modal } from "../Modal";
import { cn } from "../../lib/utils";
import { Pencil, Wallet } from "lucide-react";
import { useCreateProjectMutation, useUpdateProjectMutation } from "../../features/apiSlice";
import { toast } from "react-toastify";
import { Loading } from "../shared/Loading";
 
const projectSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  budget: yup.number().positive().required("Budget is required"),
  status: yup
    .string()
    .oneOf(["planning", "active", "on_hold", "completed", "cancelled"])
    .required(),
  startDate: yup.string().required(),
  endDate: yup.string().required(),
  managedBy: yup.string().required(),
});
const statuses = ['planning', 'active', 'on_hold', 'completed'] as const;


type Props = {
  setEditingProject: React.Dispatch<React.SetStateAction<Project | null>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingProject: Project | null;
  isModalOpen: boolean;
};
const ProjectFormModal = ({
  editingProject,
  setEditingProject,
  isModalOpen,
  setIsModalOpen,
}: Props) => {

    const [createProject, {isLoading:creating}] = useCreateProjectMutation()
    const [updateProject, {isLoading:updating}] = useUpdateProjectMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(projectSchema),
  });
  useEffect(() => {
    if (editingProject) {
      reset(editingProject);
    } else {
      reset({
        title: "",
        description: "",
        budget: 0,
        status: statuses[0],
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        managedBy: "",
      });
    }
  }, [editingProject]);

  const onSubmit = async (data: Partial<Project>) => {
    if (editingProject) {
     const pro = await updateProject(data)
        if(pro.data?.success){
            toast.success("project updated");
            setEditingProject(null)
        }else{
            toast.error("Failed. Try again")
        }
        
    } else {
        const newpro = await createProject(data)
        if(newpro.data?.success){
            toast.success("New project created");
        }else{
            toast.error("Failed. Try again")
        }
    }
    setIsModalOpen(false);
  };
  return (
    <div>
      {/* Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingProject
            ? "Update Project Details"
            : "Initiate Infrastructure Project"
        }
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">
              Project Title
            </label>
            <input
              {...register("title")}
              className={cn(
                "w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm",
                errors.title ? "border-red-500" : "border-gray-200",
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Budget (KES)
              </label>
              <div className="relative">
                <Wallet
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="number"
                  {...register("budget")}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Project Status
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              >
                {[
                  "planning",
                  "active",
                  "on_hold",
                  "completed",
                  "cancelled",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                End Date (Estimate)
              </label>
              <input
                type="date"
                {...register("endDate")}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">
              Project Manager
            </label>
            <input
              {...register("managedBy")}
              placeholder="e.g. Kennedy Ouko"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600"
            >
              Cancel
            </button>
            <button
            disabled={updating || creating}
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 flex items-center gap-2"
            >
              <Pencil   size={16} />
            { (creating || updating)?<Loading size="sm" />: "  Record Project"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectFormModal;
