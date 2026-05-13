import  { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Calendar, GraduationCap, Info, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import {  useGetSchoolByIDQuery, useUpdateSchoolMutation } from '../../features/apiSlice';
import { cn } from '../../lib/utils';
import { School } from '@/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

// Validation Schema
const schoolSchema = yup.object().shape({
  currentTerm: yup.string().oneOf(['Term 1', 'Term 2', 'Term 3']).required('Term is required'),
  currentYear: yup.string()
    .matches(/^\d{4}$/, 'Must be a valid 4-digit year')
    .required('Year is required'),
});

const SchoolSettings = () => {
    const user = useSelector((state:RootState)=>state.user.value)
  const { data: schoolData, isLoading: fetching } = useGetSchoolByIDQuery(user?.schoolId as string);
  const [updateSchool, { isLoading: updating }] = useUpdateSchoolMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schoolSchema)
  });

  // Sync form with data when it arrives
  useEffect(() => {
    if (schoolData?.data) {
      reset({
        currentTerm: schoolData.data.currentTerm,
        currentYear: schoolData.data.currentYear,
      });
    }
  }, [schoolData, reset]);

  const onSubmit = async (data: Partial<School>) => {
    try {
      const result = await updateSchool({
        _id: schoolData?.data._id,
        ...data
      }).unwrap();
      
      if (result.success) {
        toast.success("Academic period updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update school settings");
    }
  };

  if (fetching) return <div className="p-8 text-center text-gray-500 animate-pulse font-bold">Loading school data...</div>;

  return (
    <div className="max-w-2xl">
      <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl mb-8 flex gap-3">
        <Info className="text-indigo-600 shrink-0" size={20} />
        <p className="text-sm text-indigo-700 font-medium">
          Updating the Current Term or Year will affect fee structures and requirement tracking globally across the system.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Read-Only School Name */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">School Name</label>
          <div className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 font-bold flex items-center gap-2 cursor-not-allowed">
            <GraduationCap size={16} />
            {schoolData?.data.name}
          </div>
          <p className="text-[10px] text-gray-400 italic">Name is immutable for this license.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Term Selection */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
              Active Academic Term
            </label>
            <select 
              {...register('currentTerm')} 
              className={cn(
                "w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm transition-all focus:ring-2 focus:ring-indigo-500/10 outline-none",
                errors.currentTerm ? "border-red-500" : "border-gray-200 focus:border-indigo-500"
              )}
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
            {errors.currentTerm && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.currentTerm.message}</p>}
          </div>

          {/* Year Input */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
               Active Year
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="e.g. 2024"
                {...register('currentYear')} 
                className={cn(
                  "w-full pl-9 pr-4 py-2 bg-gray-50 border rounded-lg text-sm font-bold transition-all focus:ring-2 focus:ring-indigo-500/10 outline-none",
                  errors.currentYear ? "border-red-500" : "border-gray-200 focus:border-indigo-500"
                )}
              />
            </div>
            {errors.currentYear && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.currentYear.message}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={updating}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            {updating ? "Saving..." : (
              <>
                <Save size={18} />
                Update School Details
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SchoolSettings;