import { Grade } from "@/types";
import { ChevronRight, Edit2, Plus } from "lucide-react";
import React, { useState } from "react";
import GradeDetailsModal from "./GradeDetailsModal";
type Props = {
  grade: Grade;
  handleEditGrade: (grade: Grade) => void;
};
export const GradeCard = ({ grade, handleEditGrade }: Props) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const teacher = grade.classTeacher;
  const studentCount = grade.studentCount;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-lg">
            {grade.name.match(/\d+/)?.[0] || "G"}
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleEditGrade(grade)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
            >
              <Edit2 size={16} />
            </button>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900">{grade.name}</h3>
        <p className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
          {grade.stream} Stream
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <Plus size={14} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">
                Class Teacher
              </p>
              <p className="text-sm font-semibold">
                {teacher
                  ? `${teacher.firstName} ${teacher.lastName}`
                  : "Unassigned"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Plus size={14} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">
                Enrolled Students
              </p>
              <p className="text-sm font-semibold">{studentCount} Students</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          setIsDetailModalOpen(true);
        }}
        className="w-full py-4 bg-gray-50 border-t border-gray-100 text-xs font-bold text-indigo-600 hover:bg-indigo-50 flex items-center justify-center gap-2 transition-colors uppercase tracking-widest"
      >
        Manage Fees & Requirements
        <ChevronRight size={14} />
      </button>
      {/* Grade Details Modal (Fees & Requirements) */}
      <GradeDetailsModal
        isDetailModalOpen={isDetailModalOpen}
        activeGrade={grade}
        setIsDetailModalOpen={setIsDetailModalOpen}
      />
    </div>
  );
};
