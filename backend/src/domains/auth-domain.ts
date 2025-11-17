import { loginValidator, registerValidator } from 'validators/auth-validator';
import z from 'zod';

export type RegisterRequest = z.infer<typeof registerValidator>;
export type LoginRequest = z.infer<typeof loginValidator>;

export type RegisterResponse = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export type LoginResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
};

export type MeResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};
