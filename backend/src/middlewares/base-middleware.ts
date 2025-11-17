import type { NextFunction, Request, Response } from 'express';
import { HTTPException } from '../exceptions/http-exception';
import { HTTPResponse } from '../libs/http';
import { Middleware } from '../types/common';

export const notFoundMiddleware: Middleware = (_, res) => {
  return new HTTPResponse().withCode(404).withMessage('Not found').finalize(res);
};

export const globalErrorMiddleware = (
  err: unknown,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) return next(err);

  const response = new HTTPResponse();

  if (err instanceof HTTPException) {
    response.withCode(err.code).withMessage(err.message).withErrors(err.errors);
  } else {
    response.withCode(500).withMessage('Internal server error');
  }

  return response.finalize(res);
};
