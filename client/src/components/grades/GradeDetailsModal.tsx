import  React, { useState } from "react";
import { Modal } from "../../components/Modal";
import { cn,  } from "../../lib/utils";
import {  Wallet, Package,  } from "lucide-react";
import { Grade,  } from "@/types";
import GradeFeesManager from "./GradeFee";
import GradeRequirementsManager from "./GradeRequirements";



type Props = {
  isDetailModalOpen: boolean;
   setIsDetailModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  activeGrade: Grade | null;
};

const GradeDetailsModal = ({
  isDetailModalOpen,
  setIsDetailModalOpen,
  activeGrade,

}: Props) => {
  const [detailTab, setDetailTab] = useState<"fees" | "requirements">("fees");


  return (
       <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`${activeGrade?.name} (${activeGrade?.stream}) Details`}
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex bg-gray-50 p-1 rounded-xl">
            <button 
              onClick={() => setDetailTab('fees')}
              className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2", detailTab === 'fees' ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700")}
            >
              <Wallet size={16} />
              Fees Management
            </button>
            <button 
              onClick={() => setDetailTab('requirements')}
              className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2", detailTab === 'requirements' ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700")}
            >
              <Package size={16} />
              Requirements List
            </button>
          </div>

          <div className="min-h-[300px]">
            {detailTab === 'fees' ? (
             <GradeFeesManager gradeId={activeGrade?._id as string} />
            ) : (
           <GradeRequirementsManager gradeId={activeGrade?._id as string}  />
            )}
          </div>
        </div>
      </Modal>
 
  );
};

export default GradeDetailsModal;