import React from "react";
import type { pagination as Pagination } from "../../types";

type Props = {
  paginationdata: Pagination;
  setpaginationdata: React.Dispatch<React.SetStateAction<Pagination>>;
  refetch: (page: number) => void;
};
const PaginationBtn = ({ 
  paginationdata,
  setpaginationdata,
  refetch,
}: Props) => {
  return (
    <div className="flex justify-between items-center px-4 py-3">
      <div className="text-sm text-slate-500">
        Showing <b>{paginationdata.page} </b> of {paginationdata.totalPages}
      </div>
      <div className="flex space-x-1">
        <button
          onClick={() => {
            setpaginationdata((prev) => {
              const page = prev.page === 1 ? 1 : prev.page - 1;
              if (page === prev.page) return prev;

              refetch(page);
              return {
                ...prev,

                page: page,
              };
            });
          }}
          className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
        >
          Prev
        </button>

        <button
          onClick={() => {
            setpaginationdata((prev) => {
              const page =
                prev.page < prev.totalPages ? prev.page + 1 : prev.page;
              if (page === prev.page) return prev;
              refetch(page);
              return {
                ...prev,

                page: page,
              };
            });
          }}
          className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationBtn;