import StudentAttendance from "../models/StudentAttendance.js";

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId };
  if (filters.gradeId) query.gradeId = filters.gradeId;
  if (filters.date) query.date = filters.date;
  return await StudentAttendance.find(query);
};

export const create = async (data) => {
  return await StudentAttendance.create(data);
};

export const bulkCreate = async (records) => {
  if (!records || records.length === 0) return [];

  // 1. Map your records into MongoDB bulk operations
  const operations = records.map((item) => ({
    updateOne: {
      filter: { date: item.date, studentId: item.studentId },
      update: { $set: item },
      upsert: true, // This handles the "update or insert" logic
    },
  }));

  // 2. Send all operations to MongoDB in a single network call
  return await StudentAttendance.bulkWrite(operations);
};
