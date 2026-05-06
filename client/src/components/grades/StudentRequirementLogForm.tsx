import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Modal } from "../Modal";
import {
  useCreateRequirementLogsMutation, useGetGradesRequirementsQuery,
} from "../../features/apiSlice";
import { Package, Calendar, MessageSquare, ListChecks } from "lucide-react";
import { toast } from "react-toastify";
import { requirementLogs } from "@/types";

// 1. Validation Schema
const logSchema = yup.object().shape({
  requirementId: yup.string().required("Requirement item is required"),
  qtyBrought: yup
    .number()
    .typeError("Quantity must be a number")
    .positive("Must be at least 1")
    .required("Quantity is required"),
  dateRecorded: yup.string().required("Date is required"),
  remarks: yup.string().optional(),
});

type Props = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  studentId:string
  gradeId:string
};

const StudentRequirementLogModal = ({ isModalOpen, setIsModalOpen , studentId, gradeId}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(logSchema),
    defaultValues: {
      dateRecorded: new Date().toISOString().split("T")[0],
    },
  });

  const {data:gradeRequirements} = useGetGradesRequirementsQuery(gradeId);
  const requirements = useMemo(() => gradeRequirements?.data ||[], [gradeRequirements?.data])
  const [createLog, { isLoading: creating }] = useCreateRequirementLogsMutation();

  const onSubmit = async (data: Omit<requirementLogs, "studentId" | "recordedBy">) => {
    const response = await createLog({...data, studentId});
    
    if (response.data?.success) {
      toast.success("Requirement log recorded successfully");
      setIsModalOpen(false);
      reset();
    } else {
      toast.error("Failed to save log. Please try again.");
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Record Student Requirement"
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        

        {/* Requirement Item Selection */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">Requirement Item</label>
          <select
            {...register("requirementId")}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
          >
            <option value="">Select an item...</option>
            {requirements.map((req) => (
              <option key={req._id} value={req._id}>
                {req.itemName} (Required: {req.requiredQty} {req.unit}) - {req.term}
              </option>
            ))}
          </select>
          {errors.requirementId && (
            <p className="text-red-500 text-[10px] font-bold uppercase">{errors.requirementId.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Quantity Brought */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Package size={16} className="text-indigo-500" />
              Qty Brought
            </label>
            <input
              type="number"
              {...register("qtyBrought")}
              placeholder="0"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-indigo-700"
            />
            {errors.qtyBrought && (
              <p className="text-red-500 text-[10px] font-bold uppercase">{errors.qtyBrought.message}</p>
            )}
          </div>

          {/* Date Recorded */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Calendar size={16} className="text-indigo-500" />
              Date Received
            </label>
            <input
              type="date"
              {...register("dateRecorded")}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Remarks */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <MessageSquare size={16} className="text-indigo-500" />
            Remarks
          </label>
          <textarea
            {...register("remarks")}
            placeholder="e.g. Items in good condition, missing 2 books..."
            rows={3}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={creating}
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all"
          >
            {creating ? "Saving..." : "Record Item"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentRequirementLogModal;