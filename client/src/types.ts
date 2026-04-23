export type role = 'superadmin'| 'admin'| 'teacher'|'finance'
export interface User {
  _id: string;
name: string;
  email: string;
  role: role;
  schoolId: string;
}

export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  admissionNo: string;
  gradeId?: string | any;
  email?: string;
  phone?: string;
  status: string;
  joinedAt?: string;
}

export interface Grade {
  _id: string;
  name: string;
  stream: string;
  classTeacherId?: string | any;
  capacity?: number;
}

export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  designation: string;
  departmentId?: string | any;
  salary: number;
  status: string;
  joinedAt?: string;
}

export interface Department {
  _id: string;
  name: string;
  description?: string;
}

export interface Payment {
  _id: string;
  studentId: string;
  student?:{firstName?:string, lastName?:string,admissionNo?:string, _id?:string, grade?:{name?:string, _id?:string}}
  receiptNo: string;
  amount: number;
  paymentFor: string;
  method: 'cash' | 'mpesa' | 'bank_transfer' | 'cheque';
  reference?: string;
  paidAt: string;
  recordedBy: string;
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
  status: 'pending' | 'approved' | 'paid';
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

export interface Supplier {
  _id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: string;
  status: 'active' | 'inactive';
}


export interface Project {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  managedBy: string;
}

export interface TimetableEntry {
  _id: string;
  gradeId: string | any;
  day: string;
  period: number;
  subject: string;
  teacherId?: string | any;
  startTime?: string;
  endTime?: string;
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

