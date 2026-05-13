import React, { useMemo, useState } from "react";
import { Plus, Edit2, Clock, MapPin } from "lucide-react";
import TimetableForm from "../components/timetable/TimetableForm";
import { Timetable } from "@/types";
import {
  useGetEmployeesQuery,
  useGetGradesQuery,
  useLazyGetTimetableQuery,
} from "../features/apiSlice";
import { toast } from "react-toastify";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

const TimetablePage: React.FC = () => {
  const { data: gradeDta } = useGetGradesQuery();
  const { data: employeeData } = useGetEmployeesQuery();
  const [getTimetableByGradeId] = useLazyGetTimetableQuery();
  const grades = useMemo(() => gradeDta?.data || [], [gradeDta?.data]);
  const employees = useMemo(
    () => employeeData?.data || [],
    [employeeData?.data],
  );

  const [selectedGradeId, setSelectedGradeId] = useState<string >("");
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Timetable | null>(null);

  const handleAdd = () => {
    if(selectedGradeId){
    setEditingSlot(null);

    setIsModalOpen(true);
    }else{
      toast.info("Select a grade first")
    }

  };

  const fecthTimetables = (gradeId: string) => {
    getTimetableByGradeId(gradeId)
      .then((resp) => {
        if (resp.data?.success) {
          setTimetables(resp.data.data || []);
        } else {
          toast.info("Grade has no timetable.");
        }
      })
      .catch(() => {
        toast.error("Error. Try again");
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Weekly Timetable</h2>
          <p className="text-gray-500 text-sm">
            Schedule and manage lessons across all grades.
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedGradeId}
            onChange={(e) => {
             fecthTimetables(e.target.value)
              setSelectedGradeId(e.target.value);
            }}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-indigo-500/20"
          >
             <option value="">
                  Select Grade
              </option>
            {grades.map((g) => (
               
              <option key={g._id} value={g._id}>
                {g.name} - {g.stream}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-200"
          >
            <Plus size={20} />
            Add Lesson
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[1200px] border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {daysOfWeek.map((day) => (
                  <th
                    key={day}
                    className="px-4 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center border-r border-gray-100 last:border-r-0"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="divide-x divide-gray-100">
                {daysOfWeek.map((day) => {
                  const lessons = timetables
                    .filter((t) => t.dayOfWeek === day)
                    .sort((a, b) => a.startTime.localeCompare(b.startTime));

                  return (
                    <td
                      key={day}
                      className="p-3 align-top bg-gray-50/20 min-h-[600px]"
                    >
                      <div className="space-y-3">
                        {lessons.map((lesson) => {
                          const teacher = lesson?.employee;

                          return (
                            <div
                              key={lesson._id}
                              className="group relative bg-white border border-gray-200 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-default"
                            >
                              {/* Time Badge */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg uppercase">
                                  <Clock size={10} />
                                  {lesson.startTime} - {lesson.endTime}
                                </div>

                                <button
                                  onClick={() => {
                                    setEditingSlot(lesson);
                                    setIsModalOpen(true);
                                  }}
                                  className="p-1.5 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                >
                                  <Edit2 size={14} />
                                </button>
                              </div>

                              {/* Subject & Teacher */}
                              <div className="space-y-1">
                                <h4 className="text-sm font-bold text-gray-900 truncate">
                                  {lesson.subject}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-600 uppercase">
                                    {teacher?.firstName[0]}
                                    {teacher?.lastName[0]}
                                  </div>
                                  {teacher
                                    ? `${teacher.firstName} ${teacher.lastName}`
                                    : "No Teacher"}
                                </div>
                              </div>

                              {/* Room Footer */}
                              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                                  <MapPin size={10} /> {lesson.room || "Lab 1"}
                                </span>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                              </div>
                            </div>
                          );
                        })}

                        {/* Add Slot Placeholder */}
                        <button
                          onClick={() => handleAdd()}
                          className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all group"
                        >
                          <Plus
                            size={16}
                            className="group-hover:scale-110 transition-transform"
                          />
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Add Lesson
                          </span>
                        </button>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Lesson Modal */}
      <TimetableForm
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedGradeId={selectedGradeId}
        editingSlot={editingSlot}
        employees={employees}
        fecthTimetables={fecthTimetables}
      />
    </div>
  );
};

export default TimetablePage;
