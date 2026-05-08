import React, { useEffect } from "react";
import { Modal } from "../Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Employee, Timetable } from "@/types";
import { useForm } from "react-hook-form";
import { Book, Clock, MapPin, User } from "lucide-react";
import {
  useCreateTimetableMutation,
  useUpdateTimetableMutation,
} from "../../features/apiSlice";
import { toast } from "react-toastify";
import { Loading } from "../shared/Loading";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

const timetableSchema = yup.object().shape({
  employeeId: yup.string().required("Teacher is required"),
  subject: yup.string().required("Subject is required"),
  dayOfWeek: yup.string().oneOf(daysOfWeek).required(),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
  room: yup.string().required("Room is required"),
});

type Props = {
  isModalOpen: boolean;
  editingSlot: Timetable | null;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedGradeId: string;
  employees: Employee[];
  fecthTimetables: (gradeId: string) => void;
};
const TimetableForm = ({
  isModalOpen,
  setIsModalOpen,
  editingSlot,
  selectedGradeId,
  employees,
  fecthTimetables,
}: Props) => {
  const [createTimetable, { isLoading: creating }] =
    useCreateTimetableMutation();
  const [updateTimetable, { isLoading: updating }] =
    useUpdateTimetableMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(timetableSchema),
  });

  useEffect(() => {
    if (editingSlot) {
      reset(editingSlot);
    } else {
      reset({
        dayOfWeek: "Monday",
        startTime: "08:00",
        endTime: "09:00",
        room: "",
        subject: "",
        employeeId: "",
      });
    }
  }, [editingSlot]);

  const onSubmit = async (data: Partial<Timetable>) => {
    let payload = {
      gradeId: selectedGradeId,
      employeeId: data.employeeId,
      subject: data.subject,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      room: data.room,
    };
    if (editingSlot) {
      const tmb = await updateTimetable({ ...payload, _id: data._id });
      if (tmb.data?.success) {
        toast.success("timetable updated");
      } else {
        toast.error("Failed. Try again");
      }
    } else {
      const newgrd = await createTimetable(payload);
      if (newgrd.data?.success) {
        toast.success("New Timetable entry added");
        reset({
          dayOfWeek: "Monday",
          startTime: "08:00",
          endTime: "09:00",
          room: "",
          subject: "",
          employeeId: "",
        });
      } else {
        toast.error("Failed. Try again");
      }
    }
    fecthTimetables(selectedGradeId)
    setIsModalOpen(false);
  };

  return (
    <div>
      {" "}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSlot ? "Edit Lesson Slot" : "Schedule New Lesson"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Subject</label>
              <div className="relative">
                <Book
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  {...register("subject")}
                  placeholder="e.g. Mathematics"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              {errors.subject && (
                <p className="text-red-500 text-[10px] font-bold">
                  {errors.subject.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Teacher</label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <select
                  {...register("employeeId")}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">Select Teacher</option>
                  {employees?.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.firstName} {t.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Day of Week
              </label>
              <select
                {...register("dayOfWeek")}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              >
                {daysOfWeek.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Room / Lab
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  {...register("room")}
                  placeholder="e.g. Room 4B"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Time */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Start Time
              </label>
              <div className="relative">
                <Clock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
                  size={16}
                />
                <input
                  type="time"
                  {...register("startTime")}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                />
              </div>
              {errors.startTime && (
                <p className="text-red-500 text-[10px] font-bold uppercase">
                  {errors.startTime.message}
                </p>
              )}
            </div>

            {/* End Time */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                End Time
              </label>
              <div className="relative">
                <Clock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
                  size={16}
                />
                <input
                  type="time"
                  {...register("endTime")}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                />
              </div>
              {errors.endTime && (
                <p className="text-red-500 text-[10px] font-bold uppercase">
                  {errors.endTime.message}
                </p>
              )}
            </div>
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
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold"
            >
              {updating || creating ? <Loading size="sm" /> : "Save Schedule"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TimetableForm;
