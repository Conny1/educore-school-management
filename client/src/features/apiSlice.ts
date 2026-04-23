import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./customBaseQuery";
import { 
  Student, 
  Grade, 
  Employee, 
  Department, 
  Payment, 
  Expense, 
  InventoryItem,
  Supplier,
  Project,
  TimetableEntry,
  User,
  LoginResponse,
  ApiResponse,
  pagination,
  findandfilter
} from "../types";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Student", "Grade", "Employee", "Department", "Payment", "Expense", "Attendance", "Inventory", "Supplier", "Project", "Timetable"],
  endpoints: (build) => ({
    // Auth
    createAccount: build.mutation<ApiResponse<User>, any>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
    }),
    login: build.mutation<LoginResponse, {email:string, password:string}>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    getauthuser: build.query<ApiResponse<User>, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    dashbardstats: build.query<any, void>({
      query: () => "/dashboard/stats",
      providesTags: ["User", "Student", "Employee", "Payment", "Expense"],
    }),

    // Students
    getStudents: build.query<ApiResponse<Student[]>, void>({
      query: () => "/students",
      providesTags: ["Student"],
    }),
    createStudent: build.mutation<Student, Partial<Student>>({
      query: (body) => ({
        url: "/students",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Student"],
    }),
    updateStudent: build.mutation<Student, { id: string; data: Partial<Student> }>({
      query: ({ id, data }) => ({
        url: `/students/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Student"],
    }),

    // Grades
    getGrades: build.query<Grade[], void>({
      query: () => "/grades",
      providesTags: ["Grade"],
    }),
    createGrade: build.mutation<Grade, Partial<Grade>>({
      query: (body) => ({
        url: "/grades",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Grade"],
    }),

    // Employees
    getEmployees: build.query<Employee[], void>({
      query: () => "/employees",
      providesTags: ["Employee"],
    }),
    createEmployee: build.mutation<Employee, Partial<Employee>>({
      query: (body) => ({
        url: "/employees",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Employee"],
    }),

    // Departments
    getDepartments: build.query<Department[], void>({
      query: () => "/finance/departments",
      providesTags: ["Department"],
    }),

    // Payments
    getPayments: build.query<ApiResponse<Payment[]>, void>({
      query: () => "/payments",
      providesTags: ["Payment"],
    }),
    createPayment: build.mutation<ApiResponse<Payment>, Partial<Payment>>({
      query: (body) => ({
        url: "/payments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payment"],
    }),
    
     updatePayment: build.mutation<ApiResponse<Payment>, Partial<Payment>>({
      query: (body) => ({
        url: `/payments/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Payment"],
    }),

    findAndfilterPayments: build.query<
      {
        success: boolean;
        data: { results: Payment[] } & pagination;
      },
      findandfilter
    >({
      query: (body) => ({
        url: `/payments/findandfilter`,
        method: "POST",
        body,
      }),
      providesTags: ["Payment"],
    }),
    

    // Expenses
    getExpenses: build.query<ApiResponse<Expense[]>, void>({
      query: () => "/expenses",
      providesTags: ["Expense"],
    }),
    createExpense: build.mutation<ApiResponse<Expense>, Partial<Expense>>({
      query: (body) => ({
        url: "/expenses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Expense"],
    }),
     updateExpense: build.mutation<ApiResponse<Expense>, Partial<Expense>>({
      query: (body) => ({
        url: `/expenses/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Expense"],
    }),

    findAndfilterExpense: build.query<
      {
        success: boolean;
        data: { results: Expense[] } & pagination;
      },
      findandfilter
    >({
      query: (body) => ({
        url: `/expenses/findandfilter`,
        method: "POST",
        body,
      }),
      providesTags: ["Expense"],
    }),
      deleteExpense: build.mutation<ApiResponse<Expense>, string>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: "DELETE",
      
      }),
      invalidatesTags: ["Expense"],
    }),

    // Attendance
    getAttendance: build.query<any[], { date: string; type: 'student' | 'employee' }>({
      query: ({ date, type }) => `/finance/attendance?date=${date}&type=${type}`,
      providesTags: ["Attendance"],
    }),
    markAttendance: build.mutation<void, { date: string; records: any[] }>({
      query: (body) => ({
        url: "/finance/attendance",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Attendance"],
    }),

    // Inventory
    getInventory: build.query<ApiResponse<InventoryItem[]>, void>({
      query: () => "/inventory",
      providesTags: ["Inventory"],
    }),
    createInventoryItem: build.mutation<ApiResponse<InventoryItem>, Partial<InventoryItem>>({
      query: (body) => ({
        url: "/inventory",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Inventory"],
    }),
     
      updateInventoryItem: build.mutation<ApiResponse<InventoryItem>, Partial<InventoryItem>>({
      query: (body) => ({
        url: `/inventory/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Inventory"],
    }),

    findAndfilterInventoryItem: build.query<
      {
        success: boolean;
        data: { results: InventoryItem[] } & pagination;
      },
      findandfilter
    >({
      query: (body) => ({
        url: `/inventory/findandfilter`,
        method: "POST",
        body,
      }),
      providesTags: ["Inventory"],
    }),
      deleteInventoryItem: build.mutation<ApiResponse<InventoryItem>, string>({
      query: (id) => ({
        url: `/inventory/${id}`,
        method: "DELETE",
      
      }),
      invalidatesTags: ["Inventory"],
    }),


    // Suppliers
    getSuppliers: build.query<ApiResponse<Supplier[]>, void>({
      query: () => "/suppliers",
      providesTags: ["Supplier"],
    }),
       createSupplier: build.mutation<ApiResponse<Supplier>, Partial<Supplier>>({
      query: (body) => ({
        url: "/suppliers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Supplier"],
    }),
      updateSupplier: build.mutation<ApiResponse<Supplier>, Partial<Supplier>>({
      query: (body) => ({
        url: `/suppliers/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Supplier"],
    }),

    findAndfilterSupplier: build.query<
      {
        success: boolean;
        data: { results: Supplier[] } & pagination;
      },
      findandfilter
    >({
      query: (body) => ({
        url: `/suppliers/findandfilter`,
        method: "POST",
        body,
      }),
      providesTags: ["Supplier"],
    }),
      deleteSupplier: build.mutation<ApiResponse<Supplier>, string>({
      query: (id) => ({
        url: `/suppliers/${id}`,
        method: "DELETE",
      
      }),
      invalidatesTags: ["Supplier"],
    }),

    // Projects
    getProjects: build.query<Project[], void>({
      query: () => "/projects",
      providesTags: ["Project"],
    }),
   createProject: build.mutation<ApiResponse<Project>, Partial<Project>>({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Project"],
    }),
      updateProject: build.mutation<ApiResponse<Project>, Partial<Project>>({
      query: (body) => ({
        url: `/projects/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Project"],
    }),

    findAndfilterProjects: build.query<
      {
        success: boolean;
        data: { results: Project[] } & pagination;
      },
      findandfilter
    >({
      query: (body) => ({
        url: `/projects/findandfilter`,
        method: "POST",
        body,
      }),
      providesTags: ["Project"],
    }),
    // Timetable
    getTimetable: build.query<TimetableEntry[], void>({
      query: () => "/timetable",
      providesTags: ["Timetable"],
    }),

    // Reports
    getReportSummary: build.query<any, void>({
      query: () => "/reports/summary",
    }),
  }),
});

export const {
  useLoginMutation,
  useCreateAccountMutation,
  useGetauthuserQuery,
  useDashbardstatsQuery,
  useGetStudentsQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useGetGradesQuery,
  useCreateGradeMutation,
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useGetDepartmentsQuery,
  // payments
  useGetPaymentsQuery,
  useCreatePaymentMutation,
  useFindAndfilterPaymentsQuery,
  // expense
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
  useFindAndfilterExpenseQuery,
  useUpdateExpenseMutation,
  // Attendance
  useGetAttendanceQuery,
  useMarkAttendanceMutation,
  // inventory
  useGetInventoryQuery,
  useCreateInventoryItemMutation,
  useFindAndfilterInventoryItemQuery,
  useDeleteInventoryItemMutation,
  useUpdateInventoryItemMutation,
  // supplier
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useFindAndfilterSupplierQuery,
  useDeleteSupplierMutation,
  // projects
  useGetProjectsQuery,
  useCreateProjectMutation,
  useFindAndfilterProjectsQuery,
  useUpdateProjectMutation,
  // timetable
  useGetTimetableQuery,
  useGetReportSummaryQuery,
} = apiSlice;
