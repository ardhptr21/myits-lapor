import { HTTPException } from '../exceptions/http-exception';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { JwtPayload, verifyToken } from '../libs/jwt';
import { getUserById } from '../repositories/user-repository';
import { Middleware } from '../types/common';

export const mustAuthMiddleware: Middleware = async (req, _, next) => {
  const token = parseBearerToken(req.headers.authorization);
  if (!token) throw new HTTPException(401, 'Unauthorized: token missing');

  try {
    const payload: JwtPayload = verifyToken(token);
    const user = await getUserById(payload.sub);

    if (!user) throw new HTTPException(401, 'Unauthorized: user not found');

    req.user = {
      ...user.toObject(),
      id: user.id as string,
    };

    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) throw new HTTPException(401, 'Token expired');
    if (err instanceof JsonWebTokenError) throw new HTTPException(401, 'Invalid token');
    return next(err);
  }
};

const parseBearerToken = (authorization: string): string => {
  if (!authorization) return null;

  const candidate = authorization.split(' ');
  if (candidate.length !== 2) return null;

  const [bearer, token] = candidate;
  if (bearer !== 'Bearer') return null;

  return token;
};
