import React, { useEffect, useMemo } from "react";
import { Modal } from "../../components/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "../../lib/utils";
import * as yup from "yup";
import { generateRandomId } from "../../lib/utils";
import { Student } from "@/types";
import {
  useCreateStudentMutation,
  useGetGradesQuery,
  useUpdateStudentMutation,
} from "../../features/apiSlice";
import { toast } from "react-toastify";

// Validation Schema
const studentSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  admissionNo: yup.string().required("Admission number is required"),
  gradeId: yup.string().required("Grade is required"),
  dob: yup.string().required("Date of birth is required"),
  gender: yup.string().oneOf(["male", "female"]).required(),
  guardianName: yup.string().required("Guardian name is required"),
  guardianPhone: yup
    .string()
    .matches(/^(07|01)\d{8}$/, "Invalid Kenyan phone")
    .required("Guardian phone is required"),
  status: yup
    .string()
    .oneOf(["active", "suspended", "transferred"])
    .required(),
});

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingStudent: Student | null;
  setEditingStudent: React.Dispatch<React.SetStateAction<Student | null>>;
};

const StudentFormModal = ({
  isModalOpen,
  setIsModalOpen,
  editingStudent,
  setEditingStudent,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(studentSchema),
  });
  const { data: gradeData } = useGetGradesQuery();
  const grades = useMemo(() => gradeData?.data || [], [gradeData?.data]);
  const [updateStudent, { isLoading: updating }] = useUpdateStudentMutation();
  const [createStudent, { isLoading: creating }] = useCreateStudentMutation();

  // Handle edit vs create state
  useEffect(() => {
    if (editingStudent) {
      reset(editingStudent);
    } else {
      reset({
        firstName: "",
        lastName: "",
        admissionNo: generateRandomId("ADM"),
        gradeId: "",
        dob: "2018-01-01",
        gender: "male",
        guardianName: "",
        guardianPhone: "",
        status: "active",
      });
    }
  }, [editingStudent]);

  const onSubmit = async (data: Partial<Student>) => {
    let payload = {
  firstName: data.firstName,
  lastName: data.lastName,
  admissionNo: data.admissionNo,
  gradeId: data.gradeId,
  dob: data.dob,
  gender: data.gender,
  guardianName: data.guardianName,
  guardianPhone: data.guardianPhone,
  status: data.status,
}
    
    if (editingStudent) {
      const stu = await updateStudent({...payload, _id:data._id});
      if (stu.data?.success) {
        toast.success("student updated");
        setEditingStudent(null)
        reset({
          firstName: "",
          lastName: "",
          admissionNo: generateRandomId("ADM"),
          gradeId: "",
          dob: "2018-01-01",
          gender: "male",
          guardianName: "",
          guardianPhone: "",
          status: "active",
        });
      } else {
        toast.error("Failed. Try again");
      }
    } else {
      const newstu = await createStudent({
        ...payload,
        enrolledAt: new Date().toISOString(),
      });
      if (newstu.data?.success) {
        toast.success("student added");
            reset({
        firstName: "",
        lastName: "",
        admissionNo: generateRandomId("ADM"),
        gradeId: "",
        dob: "2018-01-01",
        gender: "male",
        guardianName: "",
        guardianPhone: "",
        status: "active",
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
        title={editingStudent ? "Edit Student Details" : "Register New Student"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b pb-1">
                Personal Info
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">
                    First Name
                  </label>
                  <input
                    {...register("firstName")}
                    className={cn(
                      "w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm",
                      errors.firstName ? "border-red-500" : "border-gray-200",
                    )}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-[10px] font-bold">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">
                    Last Name
                  </label>
                  <input
                    {...register("lastName")}
                    className={cn(
                      "w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm",
                      errors.lastName ? "border-red-500" : "border-gray-200",
                    )}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-[10px] font-bold">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">
                    Gender
                  </label>
                  <select
                    {...register("gender")}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    {...register("dob")}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-[10px] font-bold">
                      {errors.dob.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">
                  Admission No
                </label>
                <input
                  {...register("admissionNo")}
                  readOnly={!!editingStudent}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-mono"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b pb-1">
                Academic & Contact
              </h4>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">
                  Grade / Class
                </label>
                <select
                  {...register("gradeId")}
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm",
                    errors.gradeId ? "border-red-500" : "border-gray-200",
                  )}
                >
                  <option value="">Select Grade</option>
                  {grades.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.name} - {g.stream}
                    </option>
                  ))}
                </select>
                {errors.gradeId && (
                  <p className="text-red-500 text-[10px] font-bold">
                    {errors.gradeId.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">
                  Guardian Name
                </label>
                <input
                  {...register("guardianName")}
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm",
                    errors.guardianName ? "border-red-500" : "border-gray-200",
                  )}
                />
                {errors.guardianName && (
                  <p className="text-red-500 text-[10px] font-bold">
                    {errors.guardianName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">
                  Guardian Phone
                </label>
                <input
                  placeholder="e.g. 0712345678"
                  {...register("guardianPhone")}
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm",
                    errors.guardianPhone ? "border-red-500" : "border-gray-200",
                  )}
                />
                {errors.guardianPhone && (
                  <p className="text-red-500 text-[10px] font-bold">
                    {errors.guardianPhone.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">
                  Status
                </label>
                <select
                  {...register("status")}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="transferred">Transferred</option>
                  <option value="graduated">Graduated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
            disabled={creating || updating}
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              { (creating || updating)?"Loading..."  :editingStudent ? "Update Student" : "Register Student"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentFormModal;
