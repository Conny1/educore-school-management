import { 
  School, Department, Grade, GradeFee, GradeRequirement, 
  Student, Payment, StudentRequirementLog, Employee, 
  EmployeeAttendance, StudentAttendance, Timetable, 
  Supplier, Expense, InventoryItem, Project 
} from './types';

export const school: School = {
  id: 'sch-1',
  name: 'Mshiriki Academy',
  county: 'Nairobi',
  level: 'primary',
  currentTerm: 'Term 2',
  currentYear: '2025'
};

export const departments: Department[] = [
  { id: 'dept-1', name: 'Sciences', description: 'STEM education and research' },
  { id: 'dept-2', name: 'Humanities', description: 'Languages, history and social studies' },
  { id: 'dept-3', name: 'Administration', description: 'School leadership and logistics' }
];

export const grades: Grade[] = [
  { id: 'grade-1', name: 'Grade 1', stream: 'North', level: 'Lower Primary', classTeacherId: 'emp-1' },
  { id: 'grade-2', name: 'Grade 2', stream: 'North', level: 'Lower Primary', classTeacherId: 'emp-2' },
  { id: 'grade-3', name: 'Grade 3', stream: 'South', level: 'Lower Primary', classTeacherId: 'emp-3' },
  { id: 'grade-4', name: 'Grade 4', stream: 'North', level: 'Upper Primary', classTeacherId: 'emp-4' },
  { id: 'grade-5', name: 'Grade 5', stream: 'East', level: 'Upper Primary', classTeacherId: 'emp-5' },
  { id: 'grade-6', name: 'Grade 6', stream: 'West', level: 'Upper Primary', classTeacherId: 'emp-6' }
];

export const gradeFees: GradeFee[] = grades.flatMap(g => [
  { id: `fee-${g.id}-t1`, gradeId: g.id, term: 'Term 1', year: '2025', amount: 18000, description: 'Term 1 Tuition & Fees', createdAt: '2024-12-01' },
  { id: `fee-${g.id}-t2`, gradeId: g.id, term: 'Term 2', year: '2025', amount: 18000, description: 'Term 2 Tuition & Fees', createdAt: '2025-03-01' },
  { id: `fee-${g.id}-t3`, gradeId: g.id, term: 'Term 3', year: '2025', amount: 18000, description: 'Term 3 Tuition & Fees', createdAt: '2025-08-01' },
]);

export const gradeRequirements: GradeRequirement[] = grades.flatMap(g => [
  { id: `req-${g.id}-1`, gradeId: g.id, itemName: 'Tissue boxes (Pack of 10)', requiredQty: 1, unit: 'packs', term: 'Term 2', year: '2025', isActive: true },
  { id: `req-${g.id}-2`, gradeId: g.id, itemName: 'Exercise Books (A4, 200pg)', requiredQty: 12, unit: 'pieces', term: 'Term 2', year: '2025', isActive: true },
  { id: `req-${g.id}-3`, gradeId: g.id, itemName: 'Manila Paper (Assorted)', requiredQty: 5, unit: 'sheets', term: 'Term 2', year: '2025', isActive: true }
]);

export const students: Student[] = [
  { id: 'std-1', gradeId: 'grade-4', admissionNo: 'ADM/2022/001', firstName: 'Kamau', lastName: 'Mwangi', dob: '2014-05-12', gender: 'male', guardianName: 'John Mwangi', guardianPhone: '0712345678', status: 'active', enrolledAt: '2022-01-10' },
  { id: 'std-2', gradeId: 'grade-4', admissionNo: 'ADM/2022/002', firstName: 'Zainabu', lastName: 'Abdullah', dob: '2014-08-20', gender: 'female', guardianName: 'Abdullah Omar', guardianPhone: '0722334455', status: 'active', enrolledAt: '2022-01-11' },
  { id: 'std-3', gradeId: 'grade-3', admissionNo: 'ADM/2023/005', firstName: 'Kipchumba', lastName: 'Rotich', dob: '2015-02-15', gender: 'male', guardianName: 'Mary Rotich', guardianPhone: '0733445566', status: 'active', enrolledAt: '2023-01-15' },
  { id: 'std-4', gradeId: 'grade-1', admissionNo: 'ADM/2025/012', firstName: 'Adhiambo', lastName: 'Ochieng', dob: '2018-11-30', gender: 'female', guardianName: 'Peter Ochieng', guardianPhone: '0744556677', status: 'active', enrolledAt: '2025-01-05' },
  { id: 'std-5', gradeId: 'grade-6', admissionNo: 'ADM/2020/045', firstName: 'Mutua', lastName: 'Musyoka', dob: '2012-04-04', gender: 'male', guardianName: 'James Musyoka', guardianPhone: '0755667788', status: 'active', enrolledAt: '2020-01-12' },
  // ... adding more students to reach 20 total
  { id: 'std-6', gradeId: 'grade-2', admissionNo: 'ADM/2024/022', firstName: 'Chepngetich', lastName: 'Cheruiyot', dob: '2016-09-18', gender: 'female', guardianName: 'Wilson Cheruiyot', guardianPhone: '0766778899', status: 'active', enrolledAt: '2024-01-15' },
  { id: 'std-7', gradeId: 'grade-5', admissionNo: 'ADM/2021/018', firstName: 'Waweru', lastName: 'Karanja', dob: '2013-12-25', gender: 'male', guardianName: 'Sarah Karanja', guardianPhone: '0777889900', status: 'active', enrolledAt: '2021-01-14' },
  { id: 'std-8', gradeId: 'grade-4', admissionNo: 'ADM/2022/089', firstName: 'Moraa', lastName: 'Onchiri', dob: '2014-06-30', gender: 'female', guardianName: 'David Onchiri', guardianPhone: '0788990011', status: 'active', enrolledAt: '2022-05-20' },
  { id: 'std-9', gradeId: 'grade-1', admissionNo: 'ADM/2025/044', firstName: 'Otieno', lastName: 'Odinga', dob: '2019-01-12', gender: 'male', guardianName: 'Grace Odinga', guardianPhone: '0799001122', status: 'active', enrolledAt: '2025-01-20' },
  { id: 'std-10', gradeId: 'grade-2', admissionNo: 'ADM/2024/056', firstName: 'Auma', lastName: 'Obado', dob: '2017-03-22', gender: 'female', guardianName: 'Kevin Obado', guardianPhone: '0112233445', status: 'active', enrolledAt: '2024-01-22' },
  { id: 'std-11', gradeId: 'grade-3', admissionNo: 'ADM/2023/077', firstName: 'Wanjiku', lastName: 'Maina', dob: '2015-11-05', gender: 'female', guardianName: 'Lucy Maina', guardianPhone: '0122334455', status: 'active', enrolledAt: '2023-01-25' },
  { id: 'std-12', gradeId: 'grade-4', admissionNo: 'ADM/2022/101', firstName: 'Njoroge', lastName: 'Kamau', dob: '2014-01-15', gender: 'male', guardianName: 'Alice Kamau', guardianPhone: '0133445566', status: 'active', enrolledAt: '2022-01-12' },
  { id: 'std-13', gradeId: 'grade-5', admissionNo: 'ADM/2021/112', firstName: 'Akoth', lastName: 'Adoyo', dob: '2013-08-08', gender: 'female', guardianName: 'Fred Adoyo', guardianPhone: '0144556677', status: 'active', enrolledAt: '2021-01-08' },
  { id: 'std-14', gradeId: 'grade-6', admissionNo: 'ADM/2020/123', firstName: 'Maina', lastName: 'Kibe', dob: '2012-07-27', gender: 'male', guardianName: 'Mary Kibe', guardianPhone: '0155667788', status: 'active', enrolledAt: '2020-01-27' },
  { id: 'std-15', gradeId: 'grade-1', admissionNo: 'ADM/2025/150', firstName: 'Wambui', lastName: 'Ngugi', dob: '2019-05-05', gender: 'female', guardianName: 'Paul Ngugi', guardianPhone: '0166778899', status: 'active', enrolledAt: '2025-02-05' },
  { id: 'std-16', gradeId: 'grade-2', admissionNo: 'ADM/2024/160', firstName: 'Ondieki', lastName: 'Mokaya', dob: '2017-10-10', gender: 'male', guardianName: 'Jane Mokaya', guardianPhone: '0177889900', status: 'active', enrolledAt: '2024-02-10' },
  { id: 'std-17', gradeId: 'grade-3', admissionNo: 'ADM/2023/170', firstName: 'Bitange', lastName: 'Nyamweya', dob: '2016-01-01', gender: 'male', guardianName: 'Tom Nyamweya', guardianPhone: '0188990011', status: 'active', enrolledAt: '2023-02-01' },
  { id: 'std-18', gradeId: 'grade-4', admissionNo: 'ADM/2022/180', firstName: 'Chebet', lastName: 'Ruto', dob: '2014-12-12', gender: 'female', guardianName: 'Isaac Ruto', guardianPhone: '0199001122', status: 'active', enrolledAt: '2022-02-12' },
  { id: 'std-19', gradeId: 'grade-5', admissionNo: 'ADM/2021/190', firstName: 'Nafula', lastName: 'Simiyu', dob: '2013-03-03', gender: 'female', guardianName: 'Ben Simiyu', guardianPhone: '0711111222', status: 'active', enrolledAt: '2021-03-03' },
  { id: 'std-20', gradeId: 'grade-6', admissionNo: 'ADM/2020/200', firstName: 'Kariuki', lastName: 'Ndungu', dob: '2012-11-11', gender: 'male', guardianName: 'Ester Ndungu', guardianPhone: '0712222333', status: 'active', enrolledAt: '2020-03-11' }
];

export const employees: Employee[] = [
  { id: 'emp-1', departmentId: 'dept-1', gradeId: 'grade-1', staffNo: 'STF/001', firstName: 'Evans', lastName: 'Mutunga', role: 'teacher', phone: '0711000001', email: 'evans@school.com', hireDate: '2018-01-05', status: 'active' },
  { id: 'emp-2', departmentId: 'dept-1', gradeId: 'grade-2', staffNo: 'STF/002', firstName: 'Florence', lastName: 'Awuor', role: 'teacher', phone: '0711000002', email: 'florence@school.com', hireDate: '2019-05-12', status: 'active' },
  { id: 'emp-3', departmentId: 'dept-2', gradeId: 'grade-3', staffNo: 'STF/003', firstName: 'Geoffrey', lastName: 'Kiprotich', role: 'teacher', phone: '0711000003', email: 'geoffrey@school.com', hireDate: '2020-02-15', status: 'active' },
  { id: 'emp-4', departmentId: 'dept-2', gradeId: 'grade-4', staffNo: 'STF/004', firstName: 'Hellen', lastName: 'Wambui', role: 'teacher', phone: '0711000004', email: 'hellen@school.com', hireDate: '2021-08-20', status: 'active' },
  { id: 'emp-5', departmentId: 'dept-1', gradeId: 'grade-5', staffNo: 'STF/005', firstName: 'Isaac', lastName: 'Maina', role: 'teacher', phone: '0711000005', email: 'isaac@school.com', hireDate: '2022-01-10', status: 'active' },
  { id: 'emp-6', departmentId: 'dept-2', gradeId: 'grade-6', staffNo: 'STF/006', firstName: 'Jane', lastName: 'Wawira', role: 'teacher', phone: '0711000006', email: 'jane@school.com', hireDate: '2023-01-15', status: 'active' },
  { id: 'emp-adm-1', departmentId: 'dept-3', gradeId: null, staffNo: 'ADM/001', firstName: 'Kennedy', lastName: 'Ouko', role: 'admin', phone: '0722000001', email: 'kennedy@school.com', hireDate: '2015-10-10', status: 'active' },
  { id: 'emp-adm-2', departmentId: 'dept-3', gradeId: null, staffNo: 'ADM/002', firstName: 'Lucy', lastName: 'Njeri', role: 'admin', phone: '0722000002', email: 'lucy@school.com', hireDate: '2016-03-22', status: 'active' },
  { id: 'emp-fin-1', departmentId: 'dept-3', gradeId: null, staffNo: 'FIN/001', firstName: 'Moses', lastName: 'Kuria', role: 'finance', phone: '0733000001', email: 'moses@school.com', hireDate: '2017-07-07', status: 'active' },
  { id: 'emp-sup-1', departmentId: 'dept-3', gradeId: null, staffNo: 'SUP/001', firstName: 'Nelly', lastName: 'Achieng', role: 'support', phone: '0744000001', email: 'nelly@school.com', hireDate: '2022-06-06', status: 'active' }
];

export const payments: Payment[] = [
  { id: 'pay-1', studentId: 'std-1', gradeFeeId: 'fee-grade-4-t2', receiptNo: 'RCP/2001', amount: 18000, paymentFor: 'Term 2 Fees', method: 'mpesa', reference: 'QBZ1234567', paidAt: '2025-04-10', recordedBy: 'Moses Kuria' },
  { id: 'pay-2', studentId: 'std-2', gradeFeeId: 'fee-grade-4-t2', receiptNo: 'RCP/2002', amount: 15000, paymentFor: 'Term 2 Fees (Bal)', method: 'bank_transfer', reference: 'TRF987654', paidAt: '2025-04-12', recordedBy: 'Moses Kuria' },
  { id: 'pay-3', studentId: 'std-5', gradeFeeId: 'fee-grade-6-t2', receiptNo: 'RCP/2003', amount: 18000, paymentFor: 'Term 2 Fees', method: 'mpesa', reference: 'ABX5566778', paidAt: '2025-04-13', recordedBy: 'Moses Kuria' },
  { id: 'pay-4', studentId: 'std-7', gradeFeeId: 'fee-grade-5-t2', receiptNo: 'RCP/2004', amount: 10000, paymentFor: 'Term 2 Fees (Partial)', method: 'cash', reference: 'CASH-101', paidAt: '2025-04-14', recordedBy: 'Moses Kuria' },
  { id: 'pay-5', studentId: 'std-12', gradeFeeId: 'fee-grade-4-t2', receiptNo: 'RCP/2005', amount: 18000, paymentFor: 'Term 2 Fees', method: 'mpesa', reference: 'ZTR4433221', paidAt: '2025-04-15', recordedBy: 'Moses Kuria' },
  { id: 'pay-6', studentId: 'std-14', gradeFeeId: 'fee-grade-6-t2', receiptNo: 'RCP/2006', amount: 18000, paymentFor: 'Term 2 Fees', method: 'cheque', reference: 'CHQ-887', paidAt: '2025-04-15', recordedBy: 'Moses Kuria' },
  { id: 'pay-7', studentId: 'std-19', gradeFeeId: 'fee-grade-5-t2', receiptNo: 'RCP/2007', amount: 5000, paymentFor: 'Term 2 Fees (Instalment)', method: 'mpesa', reference: 'MPY112233', paidAt: '2025-04-16', recordedBy: 'Moses Kuria' },
  { id: 'pay-8', studentId: 'std-20', gradeFeeId: 'fee-grade-6-t2', receiptNo: 'RCP/2008', amount: 18000, paymentFor: 'Term 2 Fees', method: 'mpesa', reference: 'JTY009988', paidAt: '2025-04-16', recordedBy: 'Moses Kuria' },
  { id: 'pay-9', studentId: 'std-3', gradeFeeId: 'fee-grade-3-t2', receiptNo: 'RCP/2009', amount: 18000, paymentFor: 'Term 2 Fees', method: 'bank_transfer', reference: 'BK-55', paidAt: '2025-04-17', recordedBy: 'Moses Kuria' },
  { id: 'pay-10', studentId: 'std-8', gradeFeeId: 'fee-grade-4-t2', receiptNo: 'RCP/2010', amount: 12000, paymentFor: 'Term 2 Fees (Bal next)', method: 'mpesa', reference: 'KLU778899', paidAt: '2025-04-17', recordedBy: 'Moses Kuria' },
  { id: 'pay-11', studentId: 'std-13', gradeFeeId: 'fee-grade-5-t2', receiptNo: 'RCP/2011', amount: 18000, paymentFor: 'Term 2 Fees', method: 'mpesa', reference: 'LPO990011', paidAt: '2025-04-17', recordedBy: 'Moses Kuria' },
  { id: 'pay-12', studentId: 'std-17', gradeFeeId: 'fee-grade-3-t2', receiptNo: 'RCP/2012', amount: 18000, paymentFor: 'Term 2 Fees', method: 'cash', reference: 'CASH-99', paidAt: '2025-04-18', recordedBy: 'Moses Kuria' },
  { id: 'pay-13', studentId: 'std-4', gradeFeeId: 'fee-grade-1-t2', receiptNo: 'RCP/2013', amount: 18000, paymentFor: 'Term 2 Fees', method: 'mpesa', reference: 'MBB112233', paidAt: '2025-04-18', recordedBy: 'Moses Kuria' },
  { id: 'pay-14', studentId: 'std-6', gradeFeeId: 'fee-grade-2-t2', receiptNo: 'RCP/2014', amount: 18000, paymentFor: 'Term 2 Fees', method: 'mpesa', reference: 'VCC445566', paidAt: '2025-04-18', recordedBy: 'Moses Kuria' },
  { id: 'pay-15', studentId: 'std-11', gradeFeeId: 'fee-grade-3-t2', receiptNo: 'RCP/2015', amount: 10000, paymentFor: 'Term 2 Fees (Partial)', method: 'bank_transfer', reference: 'BK-TRF77', paidAt: '2025-04-18', recordedBy: 'Moses Kuria' }
];

export const studentRequirementLogs: StudentRequirementLog[] = [
  { id: 'log-1', studentId: 'std-1', requirementId: 'req-grade-4-1', qtyBrought: 1, dateRecorded: '2025-04-10', remarks: 'Good condition', recordedBy: 'Hellen Wambui' },
  { id: 'log-2', studentId: 'std-2', requirementId: 'req-grade-4-1', qtyBrought: 1, dateRecorded: '2025-04-10', remarks: 'Good condition', recordedBy: 'Hellen Wambui' },
  { id: 'log-3', studentId: 'std-3', requirementId: 'req-grade-3-2', qtyBrought: 12, dateRecorded: '2025-04-12', remarks: 'Complete set', recordedBy: 'Geoffrey Kiprotich' },
  { id: 'log-4', studentId: 'std-4', requirementId: 'req-grade-1-1', qtyBrought: 1, dateRecorded: '2025-04-14', remarks: 'Received', recordedBy: 'Evans Mutunga' },
  { id: 'log-5', studentId: 'std-5', requirementId: 'req-grade-6-3', qtyBrought: 5, dateRecorded: '2025-04-15', remarks: 'Received', recordedBy: 'Jane Wawira' },
  { id: 'log-6', studentId: 'std-6', requirementId: 'req-grade-2-1', qtyBrought: 1, dateRecorded: '2025-04-15', remarks: 'Received', recordedBy: 'Florence Awuor' },
  { id: 'log-7', studentId: 'std-7', requirementId: 'req-grade-5-2', qtyBrought: 12, dateRecorded: '2025-04-16', remarks: 'Complete', recordedBy: 'Isaac Maina' },
  { id: 'log-8', studentId: 'std-8', requirementId: 'req-grade-4-2', qtyBrought: 10, dateRecorded: '2025-04-16', remarks: '2 missing', recordedBy: 'Hellen Wambui' },
  { id: 'log-9', studentId: 'std-9', requirementId: 'req-grade-1-2', qtyBrought: 12, dateRecorded: '2025-04-17', remarks: 'Complete', recordedBy: 'Evans Mutunga' },
  { id: 'log-10', studentId: 'std-10', requirementId: 'req-grade-2-3', qtyBrought: 5, dateRecorded: '2025-04-17', remarks: 'Received', recordedBy: 'Florence Awuor' }
];

// Simple helper to get past 5 school days
const getPastDays = (count: number) => {
  const days = [];
  const start = new Date('2025-04-18');
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() - i);
    // adjust for weekends if needed, but for dummy data we just take last 5 calendar days
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

const past5Days = getPastDays(5);

export const studentAttendance: StudentAttendance[] = students.flatMap(s => 
  past5Days.map(d => ({
    id: `att-s-${s.id}-${d}`,
    studentId: s.id,
    gradeId: s.gradeId,
    date: d,
    status: Math.random() > 0.1 ? 'present' : 'absent',
    remarks: '',
    recordedBy: 'System'
  }))
);

export const employeeAttendance: EmployeeAttendance[] = employees.flatMap(e => 
  past5Days.map(d => ({
    id: `att-e-${e.id}-${d}`,
    employeeId: e.id,
    date: d,
    status: Math.random() > 0.05 ? 'present' : 'absent',
    checkIn: '07:30',
    checkOut: '17:00',
    remarks: '',
    recordedBy: 'System'
  }))
);

export const suppliers: Supplier[] = [
  { id: 'sup-1', name: 'Nairobi Stationery Ltd', contactPerson: 'Peter Kariuki', phone: '0700111222', email: 'peter@stationery.co.ke', category: 'Stationery', status: 'active' },
  { id: 'sup-2', name: 'Fresh Farms Kenya', contactPerson: 'Wanjiku Muriuki', phone: '0711222333', email: 'wanjiku@farms.co.ke', category: 'Food', status: 'active' },
  { id: 'sup-3', name: 'Construction Experts', contactPerson: 'James Otieno', phone: '0722333444', email: 'james@builders.co.ke', category: 'Construction', status: 'active' },
  { id: 'sup-4', name: 'Apex General Wholesalers', contactPerson: 'Sarah Adhiambo', phone: '0733444555', email: 'sarah@apex.co.ke', category: 'General', status: 'active' },
  { id: 'sup-5', name: 'Green Power Solns', contactPerson: 'Ben Mutua', phone: '0744555666', email: 'ben@greenpower.co.ke', category: 'Energy', status: 'active' }
];

export const expenses: Expense[] = [
  { id: 'exp-1', supplierId: 'sup-1', employeeId: 'emp-adm-1', description: 'Exam Printing Papers', category: 'Stationery', amount: 4500, expenseDate: '2025-04-10', receiptNo: 'EXP/001', status: 'paid' },
  { id: 'exp-2', supplierId: 'sup-2', employeeId: 'emp-adm-2', description: 'Staff Lunch (April)', category: 'Food', amount: 15000, expenseDate: '2025-04-12', receiptNo: 'EXP/002', status: 'paid' },
  { id: 'exp-3', supplierId: null, employeeId: 'emp-adm-1', description: 'Electricity Bill - March', category: 'Utilities', amount: 8200, expenseDate: '2025-04-13', receiptNo: 'EXP/003', status: 'paid' },
  { id: 'exp-4', supplierId: 'sup-4', employeeId: 'emp-adm-2', description: 'Cleaning Supplies', category: 'Maintenance', amount: 3200, expenseDate: '2025-04-14', receiptNo: 'EXP/004', status: 'approved' },
  { id: 'exp-5', supplierId: 'sup-5', employeeId: 'emp-adm-1', description: 'Solar Maintenance', category: 'Maintenance', amount: 12500, expenseDate: '2025-04-15', receiptNo: 'EXP/005', status: 'paid' },
  { id: 'exp-6', supplierId: 'sup-1', employeeId: 'emp-adm-2', description: 'Ink Cartridges', category: 'Stationery', amount: 7800, expenseDate: '2025-04-15', receiptNo: 'EXP/006', status: 'approved' },
  { id: 'exp-7', supplierId: null, employeeId: 'emp-adm-1', description: 'Water Bill - March', category: 'Utilities', amount: 2500, expenseDate: '2025-04-16', receiptNo: 'EXP/007', status: 'paid' },
  { id: 'exp-8', supplierId: 'sup-4', employeeId: 'emp-fin-1', description: 'First Aid Kit Refill', category: 'General', amount: 5600, expenseDate: '2025-04-16', receiptNo: 'EXP/008', status: 'pending' },
  { id: 'exp-9', supplierId: 'sup-1', employeeId: 'emp-adm-2', description: 'Textbooks for Library', category: 'Stationery', amount: 22000, expenseDate: '2025-04-17', receiptNo: 'EXP/009', status: 'approved' },
  { id: 'exp-10', supplierId: 'sup-2', employeeId: 'emp-adm-1', description: 'Fruit Supply for Prize Giving', category: 'Food', amount: 6500, expenseDate: '2025-04-18', receiptNo: 'EXP/010', status: 'paid' }
];

export const inventoryItems: InventoryItem[] = [
  { id: 'inv-1', supplierId: 'sup-1', name: 'A4 Printing Paper', category: 'Stationery', quantity: 5, reorderLevel: 10, unitCost: 650, unit: 'reams', lastUpdated: '2025-04-10' },
  { id: 'inv-2', supplierId: 'sup-1', name: 'Red Pens', category: 'Stationery', quantity: 50, reorderLevel: 20, unitCost: 15, unit: 'pieces', lastUpdated: '2025-04-10' },
  { id: 'inv-3', supplierId: 'sup-1', name: 'Blue Pens', category: 'Stationery', quantity: 15, reorderLevel: 30, unitCost: 15, unit: 'pieces', lastUpdated: '2025-04-10' },
  { id: 'inv-4', supplierId: 'sup-1', name: 'Whiteboard Markers', category: 'Stationery', quantity: 12, reorderLevel: 24, unitCost: 120, unit: 'pieces', lastUpdated: '2025-04-10' },
  { id: 'inv-5', supplierId: 'sup-4', name: 'Hand Wash (5L)', category: 'General', quantity: 15, reorderLevel: 5, unitCost: 1200, unit: 'gallons', lastUpdated: '2025-04-12' },
  { id: 'inv-6', supplierId: 'sup-4', name: 'Floor Cleaner (5L)', category: 'General', quantity: 8, reorderLevel: 5, unitCost: 950, unit: 'gallons', lastUpdated: '2025-04-12' },
  { id: 'inv-7', supplierId: 'sup-4', name: 'Tissue Packs', category: 'General', quantity: 100, reorderLevel: 50, unitCost: 400, unit: 'packs', lastUpdated: '2025-04-12' },
  { id: 'inv-8', supplierId: 'sup-1', name: 'Staplers', category: 'Stationery', quantity: 20, reorderLevel: 5, unitCost: 450, unit: 'pieces', lastUpdated: '2025-04-10' },
  { id: 'inv-9', supplierId: 'sup-1', name: 'Staples (Box of 1000)', category: 'Stationery', quantity: 50, reorderLevel: 10, unitCost: 80, unit: 'boxes', lastUpdated: '2025-04-10' },
  { id: 'inv-10', supplierId: 'sup-1', name: 'Files (Plastic)', category: 'Stationery', quantity: 200, reorderLevel: 50, unitCost: 45, unit: 'pieces', lastUpdated: '2025-04-10' },
  { id: 'inv-11', supplierId: 'sup-1', name: 'Files (Hard Case)', category: 'Stationery', quantity: 30, reorderLevel: 10, unitCost: 250, unit: 'pieces', lastUpdated: '2025-04-10' },
  { id: 'inv-12', supplierId: 'sup-4', name: 'Chalk Boxes (White)', category: 'Stationery', quantity: 100, reorderLevel: 40, unitCost: 150, unit: 'boxes', lastUpdated: '2025-04-10' },
  { id: 'inv-13', supplierId: 'sup-4', name: 'Chalk Boxes (Coloured)', category: 'Stationery', quantity: 40, reorderLevel: 20, unitCost: 180, unit: 'boxes', lastUpdated: '2025-04-10' },
  { id: 'inv-14', supplierId: 'sup-4', name: 'Erasers (Whiteboard)', category: 'Stationery', quantity: 24, reorderLevel: 12, unitCost: 80, unit: 'pieces', lastUpdated: '2025-04-10' },
  { id: 'inv-15', supplierId: 'sup-4', name: 'Dustbins (Office)', category: 'General', quantity: 5, reorderLevel: 10, unitCost: 850, unit: 'pieces', lastUpdated: '2025-04-12' }
];

export const projects: Project[] = [
  { id: 'proj-1', title: 'Solar Power Installation', description: 'Installing solar panels for the main admin block and computer lab.', budget: 450000, status: 'active', startDate: '2025-03-01', endDate: '2025-06-30', managedBy: 'Kennedy Ouko' },
  { id: 'proj-2', title: 'Library Expansion', description: 'Building an extension to the library to accommodate more students.', budget: 1200000, status: 'planning', startDate: '2025-05-15', endDate: '2025-12-15', managedBy: 'Lucy Njeri' },
  { id: 'proj-3', title: 'Computer Lab Upgrade', description: 'Procurement of 20 new desktop computers and networking.', budget: 850000, status: 'on_hold', startDate: '2025-02-10', endDate: '2025-05-10', managedBy: 'Kennedy Ouko' },
  { id: 'proj-4', title: 'Perimeter Wall Repair', description: 'Fixing the southern section of the perimeter wall.', budget: 220000, status: 'completed', startDate: '2025-01-15', endDate: '2025-02-28', managedBy: 'Lucy Njeri' }
];

export const timetables: Timetable[] = [
  { id: 'tt-1', gradeId: 'grade-4', employeeId: 'emp-4', subject: 'Mathematics', dayOfWeek: 'Monday', startTime: '08:00', endTime: '09:00', room: 'Room 4A' },
  { id: 'tt-2', gradeId: 'grade-4', employeeId: 'emp-4', subject: 'English', dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00', room: 'Room 4A' },
  { id: 'tt-3', gradeId: 'grade-4', employeeId: 'emp-5', subject: 'Science', dayOfWeek: 'Monday', startTime: '10:30', endTime: '11:30', room: 'Lab 1' },
  { id: 'tt-4', gradeId: 'grade-4', employeeId: 'emp-6', subject: 'Swahili', dayOfWeek: 'Monday', startTime: '11:30', endTime: '12:30', room: 'Room 4A' },
  { id: 'tt-5', gradeId: 'grade-4', employeeId: 'emp-4', subject: 'Social Studies', dayOfWeek: 'Tuesday', startTime: '08:00', endTime: '09:00', room: 'Room 4A' },
];
