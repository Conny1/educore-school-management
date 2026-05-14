export type role = "superadmin" | "admin" | "teacher" | "finance" | "management";
export interface School {
  _id: string;
  name: string;
  currentTerm: "Term 1" | "Term 2" | "Term 3";
  currentYear: string;
}
export interface User {
  _id: string;
  name: string;
  email: string;
  password:string
  role: role;
  schoolId: string;
  employeeId:string
}

export interface Student {
  _id: string;
  gradeId: string;
  grade?: { _id?: string; name?: string; stream?: string };
  admissionNo: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: "male" | "female";
  guardianName: string;
  guardianPhone: string;
  status: "active" | "suspended" | "transferred" | "graduated";
  enrolledAt: string;
}
export interface studentFinancial {
  term: string;
  year: string;
  amount: number;
  paid: number;
  balance: number;
  _id: string;
}
export interface Grade {
  _id: string;
  name: string; // e.g. "Grade 4"
  stream: string; // e.g. "North", "South", or "" if no stream
  level: string;
  classTeacherId: string | null;
  classTeacher?: { _id?: string; firstName?: string; lastName?: string };
  studentCount: number;
}

export interface GradeFee {
  _id: string;
  gradeId: string;
  term: "Term 1" | "Term 2" | "Term 3";
  year: string;
  amount: number; // e.g. 20000 (KES)
  description: string;
  createdAt: string;
}

export interface GradeRequirement {
  _id: string;
  gradeId: string;
  itemName: string; // e.g. "Tissue boxes"
  requiredQty: number;
  unit: string; // e.g. "boxes", "reams", "pieces"
  term: "Term 1" | "Term 2" | "Term 3";
  year: string;
  isActive: boolean;
}
export interface reqStatus {
  requirementId: string;
  itemName: string;
  requiredQty: number;
  unit: string;
  term: string;
  year: string;
  broughtQty: number;
  isComplete: Boolean;
  pendingQty: number;
}
export interface StudentAttendance {
  _id: string;
  studentId: string;
  gradeId: string;
  date: string;
  status: 'present' | 'absent';
  remarks: string;
  // recordedBy: string;
}
export interface requirementLogs {
      studentId: string,
    requirementId: string,
    qtyBrought: number,
    dateRecorded: string
    remarks?: string
    recordedBy: string
}
export interface Employee {
  _id: string;
  departmentId: string;
  department: { _id?: string; name?: string };
  gradeId: string | null;
  grade: { _id?: string; name?: string };
  staffNo: string;
  firstName: string;
  lastName: string;
  role: "teacher" | "admin" | "support" | "management" | "finance";
  phone: string;
  email: string;
  hireDate: string;
  status: "active" | "inactive" | "on_leave";
}

export interface employeeStats {
  total: number;
  active: number;
  teachers: number;
  onLeave: number; 
}

export interface Department {
  _id: string;
  name: string;
  description?: string;
}

export interface Payment {
  _id: string;
  studentId: string;
  student?: {
    firstName?: string;
    lastName?: string;
    admissionNo?: string;
    _id?: string;
    grade?: { name?: string; _id?: string };
  };
  receiptNo: string;
  amount: number;
  paymentFor: string;
  method: "cash" | "mpesa" | "bank_transfer" | "cheque";
  reference?: string;
  paidAt: string;
  recordedBy: string;
  gradeFeeId: string;
}

export interface studentBalance {
  studentName: string;
  admissionNo: string;
  grade: string;
  owed: number;
  paid: number;
  balance: number;
  term: string;
  year: string;
}
export interface Expense {
  _id: string;
  supplierId: string | null;
  employeeId: string;
  description: string;
  category: string;
  amount: number;
  expenseDate: string;
  receiptNo: string;
  status: "pending" | "approved" | "paid";
}

export interface InventoryItem {
  _id: string;
  supplierId: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unitCost: number;
  unit: string;
  lastUpdated: string;
}

export interface InventoryAlerts {
  _id: string;
  name: string;
  quantity: number;
  reorderLevel: number;
  unit: string;
  shortfall: string;
  supplierName: string;
  supplierContact: string;
}

export interface Supplier {
  _id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: string;
  status: "active" | "inactive";
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: "planning" | "active" | "on_hold" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  managedBy: string;
}

export interface Timetable {
  _id: string;
  gradeId: string;
  employeeId: string;
  employee?:{firstName:string, lastName:string,}
  subject: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  room: string;
}
export interface LoginResponse {
  success: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    role: role;
    schoolId: string;
  };
  refreshToken: string;
  accessToken: string;
}

export interface UserResponse {
  status: number;
  data: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export type findandfilter = {
  match_values: object;
  sortBy: string;
  limit: number;
  page: number;
  search: string;
};

export type pagination = {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

export type dashbardstats = {
  studentCount: number;
  staffCount: number;
};
