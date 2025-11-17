export class HTTPException extends Error {
  public code: number;
  public message: string;
  public errors?: Record<string, unknown>;

  public constructor(code: number, message: string, errors?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.message = message;
    this.errors = errors;
  }
}
