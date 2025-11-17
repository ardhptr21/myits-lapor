import { HTTPException } from '../exceptions/http-exception';
import { Middleware } from '../types/common';

export const allowAccess =
  (allowedRole: 'user' | 'admin'): Middleware =>
  (req, _, next) => {
    if (!req.user || req.user.role !== allowedRole) {
      throw new HTTPException(403, 'Access denied');
    }
    return next();
  };

export const disallowAccess =
  (disallowedRole: 'user' | 'admin'): Middleware =>
  (req, _, next) => {
    if (!req.user || req.user.role === disallowedRole) {
      throw new HTTPException(403, 'Access denied');
    }
    return next();
  };
