import { RegisterRequest } from 'domains/auth-domain';
import { User } from '../models/user';

export const userExistsByEmail = async (email: string) => {
  const count = await User.countDocuments({ email });
  return count > 0;
};

export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });
  return user;
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id);
  return user;
};

export const createUserFromRegister = async (payload: RegisterRequest) => {
  const newUser = new User(payload);
  await newUser.save();
  return newUser;
};
