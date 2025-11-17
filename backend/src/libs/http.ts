import { Response } from 'express';

export interface HTTPResponseType {
  success: boolean;
  code: number;
  message?: string;
  data?: unknown;
  errors?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

export class HTTPResponse<T> {
  private success: boolean;
  private code: number = 200;
  private message?: string;
  private data?: T;
  private errors?: Record<string, unknown>;
  private meta?: Record<string, unknown>;

  public withCode(code: number) {
    if (code >= 400) this.success = false;
    this.code = code;
    return this;
  }

  public withMessage(message: string) {
    this.message = message;
    return this;
  }

  public withData(data: T) {
    this.data = data;
    return this;
  }

  public withMeta(meta: Record<string, unknown>) {
    this.meta = meta;
    return this;
  }

  public withErrors(errors?: Record<string, unknown>) {
    this.success = false;
    this.errors = errors;
    return this;
  }

  private parse(): HTTPResponseType {
    return {
      success: this.success,
      code: this.code,
      message: this.message,
      meta: this.meta,
      data: this.data,
      errors: this.errors,
    };
  }

  public finalize(res: Response) {
    const payload = this.parse();
    return res.status(payload.code).json(payload);
  }
}
