import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { GradeFee, Payment } from "@/types";
import { Modal } from "../Modal";
import {
  useCreatePaymentMutation,
  useGetGradesFeeQuery,
  useGetStudentsQuery,
  useLazyGetGradesFeeQuery,
} from "../../features/apiSlice";
import { Banknote, CreditCard, Landmark, Smartphone } from "lucide-react";
import { toast } from "react-toastify";
import { generateRandomId } from "../../lib/utils";

const paymentSchema = yup.object().shape({
  studentId: yup.string().required("Student is required"),
  receiptNo: yup.string().required("Receipt number is required"),
  amount: yup
    .number()
    .positive("Amount must be positive")
    .required("Amount is required"),
  paymentFor: yup.string().required("Purpose is required"),
  method: yup
    .string()
    .oneOf(["cash", "mpesa", "bank_transfer", "cheque"])
    .required("Method is required"),
  reference: yup.string().when("method", {
    is: "mpesa",
    then: (schema) => schema.required("Reference is required"),
    otherwise: (schema) => schema.nullable().notRequired(),
  }),
  paidAt: yup.string().required("Payment date is required"),
});

type Props = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
};
const PaymentFormModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(paymentSchema),
    defaultValues: {
      paidAt: new Date().toISOString().split("T")[0],
      method: "mpesa",
      receiptNo: generateRandomId("RCP"),
    },
  });
  const [getFeesByGrade] = useLazyGetGradesFeeQuery();
  const [fees, setfees] = useState<GradeFee[]>([]);
  const [createPayment, { isLoading: creating }] = useCreatePaymentMutation();
  const { data: studentData } = useGetStudentsQuery();
  const students = useMemo(() => studentData?.data || [], [studentData?.data]);

  const selectedMethod = watch("method");

  const onSubmit = async (data: Partial<Payment>) => {
    const newinv = await createPayment({
      ...data,
      gradeFeeId: data.paymentFor,
    });
    if (newinv.data?.success) {
      toast.success("payments created");
      reset({ receiptNo: generateRandomId("RCP") });
    } else {
      toast.error("Failed. Try again");
    }
    setIsModalOpen(false);
    reset();
  };
  return (
    <div>
      {" "}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record New Payment"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">
              Select Student
            </label>
            <select
              {...(register("studentId", {
                  onChange:(e)=> {
                  let grade = students.find(
                    (item) => item._id === e.target.value,
                  );
                  if (grade) {
                    getFeesByGrade(grade.gradeId).then((resp)=>{
                      if(resp.data?.success){
                        setfees(resp.data?.data || [])
                      }
                    })
                  }
                },
              }))}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">Choose a student...</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.firstName} {s.lastName} ({s.admissionNo})
                </option>
              ))}
            </select>
            {errors.studentId && (
              <p className="text-red-500 text-[10px] font-bold">
                {errors.studentId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Receipt Number
              </label>
              <input
                {...register("receiptNo")}
                placeholder="RCP/xxxx"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Amount (KES)
              </label>
              <input
                type="number"
                {...register("amount")}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-indigo-700"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">
              Payment Purpose
            </label>
            <select
              {...register("paymentFor")}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            >
              {fees.map((item) => {
                return (
                  <option value={item._id}>
                    fees for {item.term}- Year- {item.year}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700 block">
              Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "mpesa", icon: Smartphone, label: "M-Pesa" },
                { id: "cash", icon: Banknote, label: "Cash" },
                { id: "bank_transfer", icon: Landmark, label: "Bank" },
                { id: "cheque", icon: CreditCard, label: "Cheque" },
              ].map((m) => (
                <label key={m.id} className="cursor-pointer group">
                  <input
                    type="radio"
                    {...register("method")}
                    value={m.id}
                    className="sr-only peer"
                  />
                  <div className="flex flex-col items-center gap-2 p-3 border border-gray-100 rounded-xl bg-gray-50 peer-checked:bg-white peer-checked:border-indigo-600 peer-checked:text-indigo-600 peer-checked:shadow-md transition-all">
                    <m.icon size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {m.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Reference / Ref No.
              </label>
              <input
                {...register("reference")}
                placeholder={
                  selectedMethod === "mpesa" ? "e.g. QBX12345" : "e.g. TRF-101"
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm uppercase"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Date Paid
              </label>
              <input
                type="date"
                {...register("paidAt")}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              />
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
              disabled={creating}
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100"
            >
              {" "}
              {creating ? "Loading..." : "Confirm Payment"}{" "}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentFormModal;
