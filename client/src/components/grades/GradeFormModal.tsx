import React, { useEffect, useMemo } from "react";
import { Modal } from "../../components/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "../../lib/utils";
import * as yup from "yup";
import { Grade } from "@/types";
import {
  useCreateGradeMutation,
  useGetEmployeesQuery,
  useUpdateGradeMutation,
} from "../../features/apiSlice";
import { toast } from "react-toastify";

// Schema
const gradeSchema = yup.object().shape({
  name: yup.string().required("Grade name is required"),
  stream: yup.string().required("Stream name is required"),
  level: yup.string().required("Level is required"),
  classTeacherId: yup.string().nullable(),
});

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeGrade: Grade | null;
  setActiveGrade: React.Dispatch<React.SetStateAction<Grade | null>>;
};

const GradeFormModal = ({
  isModalOpen,
  setIsModalOpen,
  activeGrade,
  setActiveGrade,
}: Props) => {
  const { data: employees } = useGetEmployeesQuery();
  const teachers = useMemo(() => employees?.data || [], [employees?.data]);
  const [createGrade, { isLoading: creating }] = useCreateGradeMutation();
  const [updateGrade, { isLoading: updating }] = useUpdateGradeMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(gradeSchema),
  });

  useEffect(() => {
    if (activeGrade) {
      reset(activeGrade);
    } else {
      reset({
        name: "",
        stream: "",
        level: "Lower Primary",
        classTeacherId: "",
      });
    }
  }, [activeGrade, reset]);

  const onSubmit = async (data: Partial<Grade>) => {
    let payload = {
      name: data.name,
      stream: data.stream,
      level: data.level,
      classTeacherId: data.classTeacherId,
    };
    if (activeGrade) {
      const grd = await updateGrade({ ...payload, _id: data._id });
      if (grd.data?.success) {
        toast.success("grade updated");
      } else {
        toast.error("Failed. Try again");
      }
    } else {
      const newgrd = await createGrade(payload);
      if (newgrd.data?.success) {
        toast.success("New grade created");
        reset({
          name: "",
          stream: "",
          level: "Lower Primary",
          classTeacherId: "",
        });
      } else {
        toast.error("Failed. Try again");
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeGrade ? "Edit Grade" : "Add New Grade"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Grade Name
              </label>
              <input
                {...register("name")}
                placeholder="e.g. Grade 1"
                className={cn(
                  "w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm",
                  errors.name ? "border-red-500" : "border-gray-200",
                )}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Stream</label>
              <input
                {...register("stream")}
                placeholder="e.g. North"
                className={cn(
                  "w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm",
                  errors.stream ? "border-red-500" : "border-gray-200",
                )}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Level</label>
            <select
              {...register("level")}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            >
              <option value="Lower Primary">Lower Primary</option>
              <option value="Upper Primary">Upper Primary</option>
              <option value="Junior Secondary">Junior Secondary</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">
              Class Teacher
            </label>
            <select
              {...register("classTeacherId")}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">Select Teacher</option>
              {teachers
                .filter((e) => e.role === "teacher")
                .map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.firstName} {t.lastName}
                  </option>
                ))}
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GradeFormModal;
