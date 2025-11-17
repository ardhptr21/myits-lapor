import { Request } from 'express';
import type { infer as ZodInfer, ZodType } from 'zod';
import { HTTPResponse } from '../libs/http';
import { Middleware } from '../types/common';

type ZodTypeAny = ZodType<any, any, any>;

type Loc = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

type InferLoc<T extends Loc> = {
  body: T['body'] extends ZodTypeAny ? ZodInfer<NonNullable<T['body']>> : undefined;
  query: T['query'] extends ZodTypeAny ? ZodInfer<NonNullable<T['query']>> : undefined;
  params: T['params'] extends ZodTypeAny ? ZodInfer<NonNullable<T['params']>> : undefined;
};

const validate = (schema: ZodTypeAny, data: any) => {
  const result = schema.safeParse(data);
  return {
    data: result.success ? result.data : undefined,
    error: result.success ? undefined : result.error.issues,
  };
};

export type ValidatedRequest<T extends Loc> = Request & {
  validated: InferLoc<T>;
};

export const validatorMiddleware =
  <T extends Loc>(loc: T): Middleware =>
  async (req, res, next) => {
    const { body, query, params } = loc;
    const errors: Record<string, any> = {};
    req.validated = {} as InferLoc<T>;

    if (body) {
      const result = validate(body, req.body);
      if (result.error) errors.body = result.error;
      else req.validated.body = result.data;
    }

    if (query) {
      const result = validate(query, req.query);
      if (result.error) errors.query = result.error;
      else req.validated.query = result.data;
    }

    if (params) {
      const result = validate(params, req.params);
      if (result.error) errors.params = result.error;
      else req.validated.params = result.data;
    }

    if (Object.keys(errors).length > 0) {
      return new HTTPResponse()
        .withCode(400)
        .withErrors(errors)
        .withMessage('validation failed, check your input')
        .finalize(res);
    }

    next();
  };
