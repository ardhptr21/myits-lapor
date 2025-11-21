import bcrypt from 'bcrypt';
import { HTTPException } from '../exceptions/http-exception';
import {
  LoginRequest,
  LoginResponse,
  MeResponse,
  RegisterRequest,
  RegisterResponse,
} from '../domains/auth-domain';
import { HTTPResponse } from '../libs/http';
import { generateToken } from '../libs/jwt';
import {
  createUserFromRegister,
  getUserByEmail,
  getUserById,
  userExistsByEmail,
} from '../repositories/user-repository';

export const registerService = async (
  body: RegisterRequest
): Promise<HTTPResponse<RegisterResponse>> => {
  const res = new HTTPResponse<RegisterResponse>();

  const exists = await userExistsByEmail(body.email);
  if (exists) throw new HTTPException(409, 'User with this email already exists');

  const created = await createUserFromRegister(body);
  if (!created) throw new HTTPException(500, 'Failed to create user');

  return res.withCode(201).withMessage('User registered successfully').withData({
    id: created._id.toString(),
    email: created.email,
    name: created.name,
    createdAt: created.createdAt,
  });
};

export const loginService = async (body: LoginRequest): Promise<HTTPResponse<LoginResponse>> => {
  const res = new HTTPResponse<LoginResponse>();

  const user = await getUserByEmail(body.email);
  if (!user) throw new HTTPException(401, 'Invalid email or password');

  const isPasswordValid = await bcrypt.compare(body.password, user.password);
  if (!isPasswordValid) throw new HTTPException(401, 'Invalid email or password');

  const token = generateToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return res
    .withCode(200)
    .withMessage('Login successful')
    .withData({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      token,
    });
};

export const meService = async (userId: string): Promise<HTTPResponse<MeResponse>> => {
  const res = new HTTPResponse<MeResponse>();

  const user = await getUserById(userId);
  if (!user) throw new HTTPException(404, 'User not found');

  return res.withCode(200).withMessage('User fetched successfully').withData({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
};
