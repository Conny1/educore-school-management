import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};


export function generateRandomId(str:string): string {
  const now = new Date();
  const year = now.getFullYear();
  const number = now.getTime().toString().slice(-3).padStart(3, "0");
  return `${str}-${year}-${number}`;
}


export const accessRules: Record<string, { access_routes: string[] }> = {
  superadmin: { access_routes: ["*"] },
  admin: {
    access_routes: [
      "dashboard",
      "students",
      "grades",
      "grade-requirements",
      "employees",
      "requirement-logs",
      "timetable",
      "settings",
    ],
  },
  teacher: {
    access_routes: ["dashboard", "students", "timetable"],
  },
  finance: {
    access_routes: [
      "dashboard",
      "payments",
      "expenses",
      "inventory",
      "suppliers",
      "projects",
    ],
  },
  management: {
    access_routes: [
      "dashboard",
      "students",
      "employees",
      "projects",
      "settings",
    ],
  },
};