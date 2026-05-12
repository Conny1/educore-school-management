import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { motion, AnimatePresence } from "motion/react";


import { toast } from "react-toastify";
import { useResetPasswordLinkMutation } from "../features/apiSlice";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, LogIn, Mail } from "lucide-react";
import { useState } from "react";


const schema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ResetPasswordLink = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: yupResolver(schema),
  });
    const [errorMsg, setErrorMsg] = useState("");
      const [email, setEmail] = useState("");
    
      const [sendResetLinkEmail, { isLoading }] =
    useResetPasswordLinkMutation();
  const onsubmit =  async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg("");
  
      try {
        const response = await sendResetLinkEmail({ email }).unwrap();
        if (response.success) {
        
          toast.success("Success...");
  
        }
      } catch (err: any) {
        setErrorMsg(
          err?.data?.message || "Please check your email.",
        );
      }
    };
  
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
      

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <form onSubmit={onsubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
                >
                  <AlertCircle size={18} />
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="name@school.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Send"
              )}
            </button>
          </form>

           <p className="mt-8 text-center text-sm text-gray-500">
   <Link to="/login" className=" text-xs font-bold text-blue-500 underline">
              Back to Login
          </Link>          </p>
         
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordLink;