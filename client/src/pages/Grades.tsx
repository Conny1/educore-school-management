import React, { useMemo, useState } from "react";
import {
  Plus,
} from "lucide-react";
import GradeFormModal from "../components/grades/GradeFormModal";
import { useFindAndfilterGradesQuery } from "../features/apiSlice";
import { findandfilter, Grade, pagination } from "@/types";
import PaginationBtn from "../components/shared/Pagination";
import { GradeCard } from "../components/grades/GradeCard";

const Grades: React.FC = () => {
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [activeGrade, setActiveGrade] = useState<Grade | null>(null);
  const [paginationdata, setpaginationdata] = useState<pagination>({
    page: 1,
    limit: 20,
    totalPages: 1,
    totalResults: 0,
  });
  const [filters, setfilters] = useState<findandfilter>({
    sortBy: "_id:-1",
    limit: paginationdata.limit,
    page: paginationdata.page,
    search: "",
    match_values: {},
  });
  const { data } = useFindAndfilterGradesQuery(filters);
  const grades = useMemo(() => {
    if (data?.success) {
      setpaginationdata({
        page: data.data.page,
        limit: data.data.limit,
        totalPages: data.data.totalPages,
        totalResults: data.data.totalResults,
      });
    }
    return data?.data.results || [];
  }, [data?.data]);

  const handleAddGrade = () => {
    setActiveGrade(null);
    setIsGradeModalOpen(true);
  };

  const handleEditGrade = (grade: Grade) => {
    setActiveGrade(grade);
    setIsGradeModalOpen(true);
  };

  const nextPage = (page: number) => {
    setfilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Grades & Streams</h2>
          <p className="text-gray-500 text-sm">
            Organize levels, streams, and manage requirements.
          </p>
        </div>
        <button
          onClick={handleAddGrade}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
        >
          <Plus size={20} />
          Create New Grade
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grades.map((grade) => {
          return (
            <GradeCard
              key={grade._id}
              grade={grade}
              handleEditGrade={handleEditGrade}
            />
          );
        })}
      </div>
      <PaginationBtn
        paginationdata={paginationdata}
        setpaginationdata={setpaginationdata}
        refetch={nextPage}
      />

      {/* Grade Form Modal */}
      <GradeFormModal
        isModalOpen={isGradeModalOpen}
        setIsModalOpen={setIsGradeModalOpen}
        activeGrade={activeGrade}
        setActiveGrade={setActiveGrade}
      />
    </div>
  );
};

export default Grades;
