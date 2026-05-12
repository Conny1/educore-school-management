import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Lock, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { RootState } from "../app/store";
import { useResetPasswordMutation } from "../features/apiSlice";

const ResetPassword = () => {
  const auth = useSelector((state: RootState) => state.auth.value.accessToken);
  const { token } = useParams(); // e.g., /reset-password/:token

  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [login, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await login({
        password,
        token: token as string,
      }).unwrap();
      if (response.success) {
        toast.success("Your password has been changed");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.message || " failed. Try again.");
    }
  };
  if (auth) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
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
                "Confirm"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            <Link
              to="/login"
              className=" text-xs font-bold text-blue-500 underline"
            >
              Back to login
            </Link>{" "}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
