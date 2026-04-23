export interface School {
  id: string;
  name: string;
  county: string;
  level: 'primary' | 'secondary' | 'mixed';
  currentTerm: 'Term 1' | 'Term 2' | 'Term 3';
  currentYear: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
}

export interface Grade {
  id: string;
  name: string;           // e.g. "Grade 4"
  stream: string;         // e.g. "North", "South", or "" if no stream
  level: string;
  classTeacherId: string | null;
}

export interface GradeFee {
  id: string;
  gradeId: string;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  year: string;
  amount: number;         // e.g. 20000 (KES)
  description: string;
  createdAt: string;
}

export interface GradeRequirement {
  id: string;
  gradeId: string;
  itemName: string;       // e.g. "Tissue boxes"
  requiredQty: number;
  unit: string;           // e.g. "boxes", "reams", "pieces"
  term: string;
  year: string;
  isActive: boolean;
}

export interface Student {
  id: string;
  gradeId: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'male' | 'female';
  guardianName: string;
  guardianPhone: string;
  status: 'active' | 'suspended' | 'transferred' | 'graduated';
  enrolledAt: string;
}

export interface Payment {
  id: string;
  studentId: string;
  gradeFeeId: string | null;
  receiptNo: string;
  amount: number;
  paymentFor: string;
  method: 'cash' | 'mpesa' | 'bank_transfer' | 'cheque';
  reference: string;
  paidAt: string;
  recordedBy: string;
}

export interface StudentRequirementLog {
  id: string;
  studentId: string;
  requirementId: string;
  qtyBrought: number;
  dateRecorded: string;
  remarks: string;
  recordedBy: string;
}

export interface Employee {
  id: string;
  departmentId: string;
  gradeId: string | null;
  staffNo: string;
  firstName: string;
  lastName: string;
  role: 'teacher' | 'admin' | 'support' | 'management' | 'finance';
  phone: string;
  email: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on_leave';
}

export interface EmployeeAttendance {
  id: string;
  employeeId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'on_leave' | 'half_day';
  checkIn: string | null;
  checkOut: string | null;
  remarks: string;
  recordedBy: string;
}

export interface StudentAttendance {
  id: string;
  studentId: string;
  gradeId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks: string;
  recordedBy: string;
}

export interface Timetable {
  id: string;
  gradeId: string;
  employeeId: string;
  subject: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  room: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: string;
  status: 'active' | 'inactive';
}

export interface Expense {
  id: string;
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
  id: string;
  supplierId: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unitCost: number;
  unit: string;
  lastUpdated: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  managedBy: string;
}
