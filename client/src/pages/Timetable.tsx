import React, { useState } from 'react';
import { grades, employees, timetables as mockTimetables } from '../mock/data';
import { Timetable } from '../mock/types';
import { Modal } from '../components/Modal';
import { Plus, Edit2, Clock, MapPin, User, Book } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { cn } from '../lib/utils';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
const timeSlots = [
  '08:00', '09:00', '10:00', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30'
];

const timetableSchema = yup.object().shape({
  gradeId: yup.string().required('Grade is required'),
  employeeId: yup.string().required('Teacher is required'),
  subject: yup.string().required('Subject is required'),
  dayOfWeek: yup.string().oneOf(daysOfWeek).required(),
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required'),
  room: yup.string().required('Room is required'),
});

const TimetablePage: React.FC = () => {
  const [selectedGradeId, setSelectedGradeId] = useState(grades[0]?.id || '');
  const [timetables, setTimetables] = useState<Timetable[]>(mockTimetables);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Timetable | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(timetableSchema)
  });

  const gradeTimetable = timetables.filter(t => t.gradeId === selectedGradeId);

  const handleAdd = () => {
    setEditingSlot(null);
    reset({
      gradeId: selectedGradeId,
      dayOfWeek: 'Monday',
      startTime: '08:00',
      endTime: '09:00',
      room: '',
      subject: '',
      employeeId: ''
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: any) => {
    if (editingSlot) {
      setTimetables(timetables.map(t => t.id === editingSlot.id ? { ...t, ...data } : t));
    } else {
      setTimetables([...timetables, { ...data, id: `tt-${Date.now()}` }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Weekly Timetable</h2>
          <p className="text-gray-500 text-sm">Schedule and manage lessons across all grades.</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedGradeId} 
            onChange={(e) => setSelectedGradeId(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-indigo-500/20"
          >
            {grades.map(g => <option key={g.id} value={g.id}>{g.name} - {g.stream}</option>)}
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="w-24 px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center border-r border-gray-100">Time</th>
                {daysOfWeek.map(day => (
                  <th key={day} className="px-4 py-4 text-sm font-bold text-gray-700 text-center border-r border-gray-100 last:border-r-0">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, idx) => {
                const isBreak = time === '10:00' || time === '12:30';
                return (
                  <tr key={time} className={cn("border-b border-gray-50 last:border-b-0", isBreak ? "bg-gray-50/50" : "")}>
                    <td className="px-4 py-6 text-xs font-bold text-gray-500 text-center border-r border-gray-100 align-top">
                      {time}
                    </td>
                    {daysOfWeek.map(day => {
                      if (isBreak) {
                        return (
                          <td key={`${day}-${time}`} className="px-4 py-6 text-center border-r border-gray-100 last:border-r-0 italic text-gray-400 text-xs font-medium">
                            {time === '10:00' ? 'Short Break' : 'Lunch Break'}
                          </td>
                        );
                      }

                      const lesson = gradeTimetable.find(t => t.dayOfWeek === day && t.startTime === time);
                      const teacher = lesson ? employees.find(e => e.id === lesson.employeeId) : null;

                      return (
                        <td key={`${day}-${time}`} className="px-2 py-2 border-r border-gray-100 last:border-r-0 align-top h-32">
                          {lesson ? (
                            <div className="h-full bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex flex-col justify-between group relative transition-all hover:shadow-md hover:bg-indigo-100/50">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">{lesson.subject}</span>
                                  <button 
                                    onClick={() => {
                                      setEditingSlot(lesson);
                                      reset(lesson);
                                      setIsModalOpen(true);
                                    }}
                                    className="p-1 opacity-0 group-hover:opacity-100 text-indigo-600 hover:bg-white rounded transition-all"
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                </div>
                                <p className="text-xs font-bold text-gray-900 leading-tight">
                                  {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'N/A'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="flex items-center gap-1 text-[9px] text-indigo-500 bg-white px-1.5 py-0.5 rounded border border-indigo-100">
                                  <MapPin size={8} /> {lesson.room}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full rounded-xl border border-dashed border-gray-100 flex items-center justify-center text-gray-300 font-medium text-[10px] uppercase tracking-widest opacity-0 hover:opacity-100 hover:bg-gray-50 transition-all cursor-pointer" onClick={handleAdd}>
                              Add Lesson
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lesson Modal */}
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
                  <Book className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input {...register('subject')} placeholder="e.g. Mathematics" className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                </div>
                {errors.subject && <p className="text-red-500 text-[10px] font-bold">{errors.subject.message}</p>}
             </div>
             <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Teacher</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select {...register('employeeId')} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                    <option value="">Select Teacher</option>
                    {employees.filter(e => e.role === 'teacher').map(t => (
                      <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                    ))}
                  </select>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Day of Week</label>
                <select {...register('dayOfWeek')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                  {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Room / Lab</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input {...register('room')} placeholder="e.g. Room 4B" className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Start Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select {...register('startTime')} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">End Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select {...register('endTime')} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    <option value="16:30">16:30</option>
                  </select>
                </div>
             </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold">Save Schedule</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TimetablePage;
