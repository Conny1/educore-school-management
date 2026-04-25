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
  findandfilter,
  GradeFee,
  GradeRequirement
} from "../types";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Student", "Grade","Grade-Requirements", "Grade-Fee", "Employee", "Department", "Payment", "Expense", "Attendance", "Inventory", "Supplier", "Project", "Timetable"],
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
    createStudent: build.mutation<ApiResponse<Student>, Partial<Student>>({
      query: (body) => ({
        url: "/students",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Student"],
    }),
    updateStudent: build.mutation<ApiResponse<Student>, Partial<Student> >({
      query: (data) => ({
        url: `/students/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Student"],
    }),
     findAndfilterStudents: build.query<
      {
        success: boolean;
        data: { results: Student[] } & pagination;
      },
      findandfilter
    >({
      query: (body) => ({
        url: `/students/findandfilter`,
        method: "POST",
        body,
      }),
      providesTags: ["Student"],
    }),
    

    // Grades
    getGrades: build.query<ApiResponse<Grade[]>, void>({
      query: () => "/grades",
      providesTags: ["Grade"],
    }),
    createGrade: build.mutation<ApiResponse<Grade>, Partial<Grade>>({
      query: (body) => ({
        url: "/grades",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Grade"],
    }),
      updateGrade: build.mutation<ApiResponse<Grade>, Partial<Grade> >({
      query: (data) => ({
        url: `/grades/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Grade"],
    }),
     findAndfilterGrades: build.query<
      {
        success: boolean;
        data: { results: Grade[] } & pagination;
      },
      findandfilter
    >({
      query: (body) => ({
        url: `/grades/findandfilter`,
        method: "POST",
        body,
      }),
      providesTags: ["Grade"],
    }),
    // Grade-Fee
      getGradesFee: build.query<ApiResponse<GradeFee[]>, string>({
      query: (gradeId:string) => `grade-fees?gradeId=${gradeId}`,
      providesTags: ["Grade-Fee"],
    }),
    createGradeFee: build.mutation<ApiResponse<GradeFee>, Partial<GradeFee>>({
      query: (body) => ({
        url: "/grade-fees",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Grade-Fee"],
    }),
      updateGradeFee: build.mutation<ApiResponse<GradeFee>, Partial<GradeFee> >({
      query: (data) => ({
        url: `/grade-fees/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Grade-Fee"],
    }),
    deleteGradeFee: build.mutation<ApiResponse<GradeFee>, string>({
      query: (id) => ({
        url: `/grade-fees/${id}`,
        method: "DELETE",
      
      }),
      invalidatesTags: ["Grade-Fee"],
    }),
// Grade- Requirements
     getGradesRequirements: build.query<ApiResponse<GradeRequirement[]>, string>({
      query: (gradeId) => `/grade-requirements?gradeId=${gradeId}`,
      providesTags: ["Grade-Requirements"],
    }),
    createGradeRequirements: build.mutation<ApiResponse<GradeRequirement>, Partial<GradeRequirement>>({
      query: (body) => ({
        url: "/grade-requirements",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Grade-Requirements"],
    }),
      updateGradeRequirements: build.mutation<ApiResponse<GradeRequirement>, Partial<GradeRequirement> >({
      query: (data) => ({
        url: `/grade-requirements/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Grade-Requirements"],
    }),
        deleteGradeRequirements: build.mutation<ApiResponse<GradeRequirement>, string>({
      query: (id) => ({
        url: `/grade-requirements/${id}`,
        method: "DELETE",
      
      }),
      invalidatesTags: ["Grade-Requirements"],
    }),
    // Employees
    getEmployees: build.query<ApiResponse<Employee[]>, void>({
      query: () => "/employees",
      providesTags: ["Employee"],
    }),
    createEmployee: build.mutation<ApiResponse<Employee>, Partial<Employee>>({
      query: (body) => ({
        url: "/employees",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Employee"],
    }),
        updateEmployee: build.mutation<ApiResponse<Employee>, Partial<Employee> >({
      query: (data) => ({
        url: `/employees/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Employee"],
    }),
     findAndfilterEmployees: build.query<
      {
        success: boolean;
        data: { results: Employee[] } & pagination;
      },
      findandfilter
    >({
      query: (body) => ({
        url: `/employees/findandfilter`,
        method: "POST",
        body,
      }),
      providesTags: ["Employee"],
    }),

    // Departments
    getDepartments: build.query<ApiResponse<Department[]>, void>({
      query: () => "/departments",
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
  // student
  useGetStudentsQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useFindAndfilterStudentsQuery,
  // grades
  useGetGradesQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  useFindAndfilterGradesQuery,
  // Grade-Fees
  useGetGradesFeeQuery,
  useCreateGradeFeeMutation,
  useUpdateGradeFeeMutation,
  useDeleteGradeFeeMutation,
  // Grade-Requirements
  useGetGradesRequirementsQuery,
  useCreateGradeRequirementsMutation,
  useUpdateGradeRequirementsMutation,
  useDeleteGradeRequirementsMutation,
  // employees
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useFindAndfilterEmployeesQuery,
  // departments
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
