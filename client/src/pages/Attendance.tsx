import React, { useState, useEffect, useMemo } from 'react';
import { 
  employees as mockEmployees, 
  employeeAttendance as mockEmployeeAtt 
} from '../mock/data';
import {  EmployeeAttendance } from '../mock/types';
import { Badge } from '../components/Badge';
import { cn } from '../lib/utils';
import { Calendar, Users, Briefcase, CheckCircle, XCircle, Clock, AlertCircle, Save, Search } from 'lucide-react';
import { useGetGradesQuery,  useLazyGetStudentAttendanceQuery, useLazyGetStudentsQuery, useSaveBulkAttendanceMutation,  } from '../features/apiSlice';
import { Student, StudentAttendance } from '@/types';
import { toast } from 'react-toastify';

const Attendance: React.FC = () => {
   
    const {data:gradeData} = useGetGradesQuery()
    const [getStudentsByGradeId] = useLazyGetStudentsQuery()
    const [getStudentAttndance] = useLazyGetStudentAttendanceQuery()
    const [saveBulkAttendance] = useSaveBulkAttendanceMutation()

const grades = useMemo(() => gradeData?.data || [], [gradeData?.data ])

  const [activeTab, setActiveTab] = useState<'students' | 'employees'>('students');
  const [selectedDate, setSelectedDate] = useState<string | undefined>(); // Mock today
  const [selectedGradeId, setSelectedGradeId] = useState('');

  // Local state for attendance records being marked
  const [students, setstudents] = useState<Student[]>([])
  const [studentAtt, setstudentAtt] = useState<StudentAttendance[]>([])
  const [studentRecords, setStudentRecords] = useState<StudentAttendance[]>([]);
  const [employeeRecords, setEmployeeRecords] = useState<EmployeeAttendance[]>([]);
  

  const records =useMemo(() => {
        return students.map(s => {
        const existing = studentAtt.find(a => a.studentId === s._id);
        return existing ||  {
          _id:s._id,
          studentId: s._id,
          gradeId: s.gradeId,
          date: selectedDate as string,
          status: 'present' as "present" | "absent" ,
          remarks: '',
        };
      });
      }, [ students,studentAtt])

  // Initialize records for selected date/filters
  useEffect(() => {
    if (activeTab === 'students') {
      
      setStudentRecords(records || []);

    
    } else {
      const records = mockEmployees.map(e => {
        const existing = mockEmployeeAtt.find(a => a.employeeId === e.id && a.date === selectedDate);
        return existing || {
          id: `new-e-${e.id}-${selectedDate}`,
          employeeId: e.id,
          date: selectedDate as string,
          status: 'present' as any,
          checkIn: '07:30',
          checkOut: '17:00',
          remarks: '',
          recordedBy: 'Admin'
        };
      });
      setEmployeeRecords(records);
    }
  }, [records]);

  
  const updateStudentStatus = (id: string, status: any) => {
    setStudentRecords(prev => prev.map(r => r._id === id ? { ...r, status } : r));
  };

  const updateEmployeeStatus = (id: string, status: any) => {
    setEmployeeRecords(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleSave = async() => {
    await saveBulkAttendance(studentRecords.map(({_id,...other})=>other)).then((resp)=>{
      if(resp.data?.success){
        toast.info("Attendance recorded");
      }
    }).catch(()=>{
      toast.error("Try again!")
    })
  };

  const getSummary = () => {
    const list = activeTab === 'students' ? studentRecords : employeeRecords;
    const present = list.filter(r => r.status === 'present').length;
    const absent = list.filter(r => r.status === 'absent').length;
    const late = list.filter(r => r.status === 'late').length;
    return { present, absent, late, total: list.length };
  };

  const summary = getSummary();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance Marking</h2>
          <p className="text-gray-500 text-sm">Daily roll call for students and staff.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-200"
        >
          <Save size={20} />
          Save Attendance
        </button>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 shrink-0 space-y-6">
          <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab('students')}
              className={cn("w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all", activeTab === 'students' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-500 hover:bg-gray-50")}
            >
              <Users size={18} />
              Students
            </button>
            {/* <button 
              onClick={() => setActiveTab('employees')}
              className={cn("w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all", activeTab === 'employees' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-500 hover:bg-gray-50")}
            >
              <Briefcase size={18} />
              Employees
            </button> */}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Selected Date</label>
              <div className="relative">
                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => {
                       getStudentAttndance({date:e.target.value, gradeId:selectedGradeId}).then((resp)=>{
                      if(resp.data?.success){
                        setstudentAtt(resp.data.data)
                      }
                    })
                    setSelectedDate(e.target.value)}}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium" 
                 />
              </div>
            </div>

            {activeTab === 'students' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Grade</label>
                <select 
                  value={selectedGradeId}
                  onChange={(e) => {
                    getStudentsByGradeId(e.target.value).then((resp)=>{
                      if(resp.data?.success){
                        setstudents(resp.data.data)
                      }
                    })
                    setSelectedGradeId(e.target.value)}}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium"
                >
                  <option>Select grade</option>
                  {grades.map(g => <option key={g._id} value={g._id}>{g.name} - {g.stream}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-6">
          {/* Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
               <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                  <Users size={20} />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                 <p className="text-lg font-bold text-gray-900">{summary.total}</p>
               </div>
             </div>
             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
               <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle size={20} />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Present</p>
                 <p className="text-lg font-bold text-emerald-600">{summary.present}</p>
               </div>
             </div>
             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
               <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                  <XCircle size={20} />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Absent</p>
                 <p className="text-lg font-bold text-red-600">{summary.absent}</p>
               </div>
             </div>
             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
               <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <Clock size={20} />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Late</p>
                 <p className="text-lg font-bold text-amber-600">{summary.late}</p>
               </div>
             </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">ID Reference</th>
                    <th className="px-6 py-4">Status Marking</th>
                    {activeTab === 'employees' && <th className="px-6 py-4">Check In/Out</th>}
                    <th className="px-6 py-4">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {activeTab === 'students' ? studentRecords.map(record => {
                    const student = students.find(s => s._id === record.studentId);
                    return (
                      <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">{student?.firstName} {student?.lastName}</p>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-400">{student?.admissionNo}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                             {[
                               { val: 'present', color: 'peer-checked:bg-emerald-500', icon: CheckCircle },
                               { val: 'absent', color: 'peer-checked:bg-red-500', icon: XCircle },
                               { val: 'late', color: 'peer-checked:bg-amber-500', icon: Clock },
                               { val: 'excused', color: 'peer-checked:bg-blue-500', icon: AlertCircle },
                             ].map(opt => (
                               <label key={opt.val} className="relative cursor-pointer group">
                                  <input 
                                    type="radio" 
                                    name={`status-${record._id}`} 
                                    className="sr-only peer"
                                    checked={record.status === opt.val}
                                    onChange={() => updateStudentStatus(record._id, opt.val)}
                                  />
                                  <div className={cn(
                                    "w-10 h-10 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-400 transition-all peer-checked:text-white peer-checked:shadow-lg peer-checked:scale-110",
                                    opt.color
                                  )}>
                                     <opt.icon size={18} />
                                  </div>
                                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest whitespace-nowrap z-10">
                                    {opt.val}
                                  </div>
                               </label>
                             ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            placeholder="Add memo..." 
                            className="bg-transparent border-b border-gray-100 focus:border-indigo-300 text-xs w-full py-1 focus:outline-none"
                            value={record.remarks}
                            onChange={(e) => updateStudentStatus(record._id, { ...record, remarks: e.target.value })}
                          />
                        </td>
                      </tr>
                    )
                  }) : employeeRecords.map(record => {
                    const employee = mockEmployees.find(e => e.id === record.employeeId);
                    return (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">{employee?.firstName} {employee?.lastName}</p>
                          <Badge variant={employee?.role as string} className="text-[9px] mt-1">{employee?.role}</Badge>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-400">{employee?.staffNo}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                             {[
                               { val: 'present', color: 'peer-checked:bg-emerald-500', icon: CheckCircle },
                               { val: 'absent', color: 'peer-checked:bg-red-500', icon: XCircle },
                               { val: 'late', color: 'peer-checked:bg-amber-500', icon: Clock },
                               { val: 'on_leave', color: 'peer-checked:bg-blue-500', icon: Briefcase },
                             ].map(opt => (
                               <label key={opt.val} className="relative cursor-pointer group">
                                  <input 
                                    type="radio" 
                                    name={`status-${record.id}`} 
                                    className="sr-only peer"
                                    checked={record.status === opt.val}
                                    onChange={() => updateEmployeeStatus(record.id, opt.val)}
                                  />
                                  <div className={cn(
                                    "w-10 h-10 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-400 transition-all peer-checked:text-white peer-checked:shadow-lg peer-checked:scale-110",
                                    opt.color
                                  )}>
                                     <opt.icon size={18} />
                                  </div>
                                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest whitespace-nowrap z-10">
                                    {opt.val}
                                  </div>
                               </label>
                             ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <input 
                              type="time" 
                              className="bg-gray-50 border border-gray-100 text-[10px] p-1 rounded focus:outline-none focus:ring-1 focus:ring-indigo-300" 
                              defaultValue={record.checkIn || '07:30'} 
                            />
                            <span className="text-gray-300">-</span>
                            <input 
                              type="time" 
                              className="bg-gray-50 border border-gray-100 text-[10px] p-1 rounded focus:outline-none focus:ring-1 focus:ring-indigo-300" 
                              defaultValue={record.checkOut || '17:00'} 
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            placeholder="Add memo..." 
                            className="bg-transparent border-b border-gray-100 focus:border-indigo-300 text-xs w-full py-1 focus:outline-none"
                            value={record.remarks}
                            onChange={(e) => updateEmployeeStatus(record.id, { ...record, remarks: e.target.value })}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {(activeTab === 'students' ? studentRecords : employeeRecords).length === 0 && (
               <div className="p-20 text-center space-y-3">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto">
                    <Search size={32} />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">No records found for the selected date or grade.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
