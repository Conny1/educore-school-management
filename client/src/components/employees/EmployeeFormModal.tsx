import React, { useEffect, useMemo } from "react";
import { Modal } from "../../components/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "../../lib/utils";
import * as yup from "yup";
import { generateRandomId } from "../../lib/utils";
import {
  useCreateEmployeeMutation,
  useGetDepartmentsQuery,
  useGetGradesQuery,
  useUpdateEmployeeMutation,
} from "../../features/apiSlice";
import { toast } from "react-toastify";
import { Employee } from "@/types";

// Validation Schema
const employeeSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  staffNo: yup.string().required("Staff number is required"),
  departmentId: yup.string().required("Department is required"),
  gradeId: yup
    .string()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    }),
  role: yup
    .string()
    .oneOf(["teacher", "admin", "support", "management", "finance"])
    .required(),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^(07|01)\d{8}$/, "Valid Kenyan phone required")
    .required("Phone is required"),
  hireDate: yup.string().required("Hire date is required"),
  status: yup.string().oneOf(["active", "inactive", "on_leave"]).required(),
});

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingEmployee: Employee | null;
  setEditingEmployee: React.Dispatch<React.SetStateAction<Employee | null>>;
};

const EmployeeFormModal = ({
  isModalOpen,
  setIsModalOpen,
  editingEmployee,
  setEditingEmployee,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(employeeSchema),
  });

  const selectedRole = watch("role");
  const [updateEmployee, { isLoading: updating }] = useUpdateEmployeeMutation();
  const [createEmployee, { isLoading: creating }] = useCreateEmployeeMutation();
  const { data: gradeData } = useGetGradesQuery();
  const grades = useMemo(() => gradeData?.data || [], [gradeData?.data]);
  const { data: departmentsData } = useGetDepartmentsQuery();
  const departments = useMemo(
    () => departmentsData?.data || [],
    [departmentsData?.data],
  );
  useEffect(() => {
    if (editingEmployee) {
      reset(editingEmployee);
    } else {
      reset({
        firstName: "",
        lastName: "",
        staffNo: generateRandomId("STF"),
        departmentId: "",
        gradeId: null,
        role: "teacher",
        email: "",
        phone: "",
        hireDate: new Date().toISOString().split("T")[0],
        status: "active",
      });
    }
  }, [editingEmployee, reset]);

  const onSubmit = async (data: Partial<Employee>) => {
    let payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      staffNo: data.staffNo,
      departmentId: data.departmentId,
      gradeId: data.gradeId,
      role: data.role,
      email: data.email,
      phone: data.phone,
      hireDate: data.hireDate,
      status: data.status,
    };
    if (editingEmployee) {
      const emp = await updateEmployee({ ...payload, _id: data._id });
      if (emp.data?.success) {
        toast.success("employee updated");
        setEditingEmployee(null)
      } else {
        toast.error("Failed. Try again");
      }
    } else {
      const newemp = await createEmployee(payload);
      if (newemp.data?.success) {
        toast.success("New staff added");
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
        title={
          editingEmployee ? "Edit Staff Details" : "Onboard New Staff Member"
        }
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b pb-1">
                Primary Info
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

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">
                  Staff Number
                </label>
                <input
                  {...register("staffNo")}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-mono"
                  readOnly={!!editingEmployee}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">
                    Role
                  </label>
                  <select
                    {...register("role")}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                    <option value="finance">Finance</option>
                    <option value="management">Management</option>
                    <option value="support">Support</option>
                  </select>
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
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b pb-1">
                Department & Contact
              </h4>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">
                  Department
                </label>
                <select
                  {...register("departmentId")}
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm",
                    errors.departmentId ? "border-red-500" : "border-gray-200",
                  )}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="text-red-500 text-[10px] font-bold">
                    {errors.departmentId.message}
                  </p>
                )}
              </div>

              {selectedRole === "teacher" && (
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">
                    Assigned Grade (Class Teacher)
                  </label>
                  <select
                    {...register("gradeId")}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="">None</option>
                    {grades.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.name} - {g.stream}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm",
                    errors.email ? "border-red-500" : "border-gray-200",
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] font-bold">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">
                  Phone Number
                </label>
                <input
                  {...register("phone")}
                  placeholder="e.g. 0711223344"
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm",
                    errors.phone ? "border-red-500" : "border-gray-200",
                  )}
                />
                {errors.phone && (
                  <p className="text-red-500 text-[10px] font-bold">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">
                  Hire Date
                </label>
                <input
                  type="date"
                  {...register("hireDate")}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                />
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
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              {creating || updating
                ? "Loading..."
                : editingEmployee
                  ? "Update Staff"
                  : "Add Staff Member"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeFormModal;
