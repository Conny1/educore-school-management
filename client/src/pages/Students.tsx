import React, { useMemo, useState } from 'react';
import { Badge } from '../components/Badge';
import { Search, Plus,  Edit2, Eye, MoreHorizontal } from 'lucide-react';
import { findandfilter, pagination, Student } from '@/types';
import { useFindAndfilterStudentsQuery } from '../features/apiSlice';
import PaginationBtn from '../components/shared/Pagination';
import StudentFormModal from '../components/students/StudentFormModal';
import { useNavigate } from 'react-router-dom';



const Students: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const navigate = useNavigate()

  const [paginationdata, setpaginationdata] = useState<pagination>({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
  });

  const [filters, setfilters] = useState<findandfilter>({
    sortBy: "_id:-1",
    limit: paginationdata.limit,
    page: paginationdata.page,
    search: "",
    match_values: {},
  });
  const { data,  isLoading:studentLoading } = useFindAndfilterStudentsQuery(filters);
  const students = useMemo(() => {
    if(data?.success){
      setpaginationdata({    page: data.data.page,
    limit: data.data.limit,
    totalPages: data.data.totalPages,
    totalResults: data.data.totalResults,})
    }
    return data?.data.results || []

  }, [data?.data])
  const nextPage = (page: number) => {
    setfilters((prev) => ({ ...prev, page }));
  };
    const filterStudents = (payload: findandfilter) => {
    setfilters(payload);
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

   

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Students</h2>
          <p className="text-gray-500 text-sm">Manage all enrolled students in Mshiriki Academy.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          <Plus size={20} />
          Add New Student
        </button>
      </div>

      {/* Filters/Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or admission no..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => {
                  filterStudents({
                ...filters,
                search: e.target.value,
              });
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {/* <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
            <Filter size={18} />
            Filters
          </button> */}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
                <th className="px-6 py-4">Admission No</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Grade</th>
                <th className="px-6 py-4">Guardian</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students?.length > 0 ? students.map((student) => {
                const grade =student.grade
                return (
                  <tr key={student._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 font-medium">{student.admissionNo}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{student.firstName} {student.lastName}</p>
                          <p className="text-[10px] text-gray-500 uppercase font-medium">{student.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-700">{grade?.name}</p>
                      <p className="text-[10px] text-gray-400">{grade?.stream}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 font-medium">{student.guardianName}</p>
                      <p className="text-xs text-gray-500">{student.guardianPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={student.status}>{student.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(student)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button onClick={()=>{
                        navigate(`/students/${student._id}`)
                        }} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="View Profile">
                          <Eye size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all" title="More">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
             <PaginationBtn
                  paginationdata={paginationdata}
                  setpaginationdata={setpaginationdata}
                  refetch={nextPage}
                />
      </div>

      {/* Add/Edit Modal */}
   <StudentFormModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} editingStudent={editingStudent} setEditingStudent={setEditingStudent} />

    </div>
  );
};

export default Students;
