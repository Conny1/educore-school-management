import React, { useMemo, useState } from 'react';
import { Badge } from '../components/Badge';
import { Plus, Calendar, Wallet, User, MoreHorizontal,  } from 'lucide-react';
import {  formatCurrency, formatDate } from '../lib/utils';
import { motion } from 'motion/react';
import ProjectFormModal from '../components/projects/ProjectFormModal';
import { findandfilter, pagination, Project } from '@/types';
import { useFindAndfilterProjectsQuery } from '../features/apiSlice';
import PaginationBtn from '../components/shared/Pagination';


const statuses = ['planning', 'active', 'on_hold', 'completed'] as const;



const Projects: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [paginationdata, setpaginationdata] = useState<pagination>({
    page: 1,
    limit: 20,
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
  const { data, refetch , isLoading:projectsLoading } = useFindAndfilterProjectsQuery(filters);
  const projects = useMemo(() => {
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
  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleAdd = (status: Project['status']) => {
    setEditingProject(null);
    setIsModalOpen(true);
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Infrastructure & Projects</h2>
          <p className="text-gray-500 text-sm">Monitor school development projects and construction budgets.</p>
        </div>
        <button 
          onClick={() => handleAdd('planning')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          Launch New Project
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex overflow-x-auto gap-6 pb-6 min-h-[600px] snap-x custom-scrollbar">
        {statuses.map(status => (
          <div key={status} className="w-80 shrink-0 flex flex-col gap-4 snap-start">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                 <h3 className="font-black text-xs uppercase tracking-widest text-gray-500">{status.replace('_', ' ')}</h3>
                 <span className="w-5 h-5 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                   {projects.filter(p => p.status === status).length}
                 </span>
              </div>
              <button 
                onClick={() => handleAdd(status as Project['status'])}
                className="p-1 text-gray-400 hover:text-indigo-600 rounded transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="flex-1 bg-gray-50/50 rounded-2xl p-4 space-y-4 border border-gray-100/50">
              {projects.filter(p => p.status === status).map(project => (
                <motion.div 
                  layoutId={project._id}
                  key={project._id}
                  onClick={() => handleEdit(project)}
                  className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <Badge variant={project.status} className="text-[9px]">{project.status}</Badge>
                    <button className="text-gray-300 group-hover:text-gray-500"><MoreHorizontal size={14} /></button>
                  </div>
                  
                  <div>
                    <h4 className="text font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">{project.title}</h4>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{project.description}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-50 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                       <div className="flex items-center gap-1.5 text-gray-400">
                          <Wallet size={12} />
                          <span>BUDGET</span>
                       </div>
                       <span className="text-gray-900">{formatCurrency(project.budget)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold">
                       <div className="flex items-center gap-1.5 text-gray-400">
                          <Calendar size={12} />
                          <span>END DATE</span>
                       </div>
                       <span className="text-gray-900">{formatDate(project.endDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                         <User size={12} />
                      </div>
                      <span className="text-[10px] text-gray-500 font-medium">{project.managedBy.split(' ')[0]}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {projects.filter(p => p.status === status).length === 0 && (
                <div className="h-32 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  No {status} projects
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
              <PaginationBtn
          paginationdata={paginationdata}
          setpaginationdata={setpaginationdata}
          refetch={nextPage}
        />
<ProjectFormModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} editingProject={editingProject} setEditingProject={setEditingProject}  />

    </div>
  );
};

export default Projects;
