import type { APIResponse } from './api';
import type { User } from './user';

export type LoginResponse = APIResponse<{
  user: User;
  token: string;
}>;

export type RegisterResponse = APIResponse<{
  id: string;
  name: string;
  email: string;
  createdAt: string;
}>;
