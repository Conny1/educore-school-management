import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getAll = async (filters = {}) => {
  const query = { schoolId: filters.schoolId, is_deleted: false };
  // Omit password and is_deleted
  return await User.find(query).select("-password -is_deleted");
};

export const create = async (data) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(data.password, salt);

  return await User.create({ ...data, password: hash });
};

export const update = async (id, data, schoolId) => {
  if (data?.password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(data.password, salt);
    data.password = hash;
  }
  const user = await User.findOneAndUpdate({ _id: id, schoolId }, data, {
    new: true,
    runValidators: true,
    fields: { password: 0, is_deleted: 0 }, // Omit these fields from the result
  });
  if (!user) throw new Error("user not found");
  return user;
};

export const findandfilterUser = async (filter, options) => {
  const user = await User.paginate(filter, options);
  if (!user) {
    throw createError(404, "user not found.");
  }
  return user;
};

export const delet = async (id, data, schoolId) => {
  const user = await User.findOneAndUpdate(
    { _id: id, schoolId },
    { is_deleted: true },
    { new: true, runValidators: true },
  );
  if (!user) throw new Error("user not found");
  return user;
};
