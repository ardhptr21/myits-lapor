export interface MetaResponse {
  page: number;
  limit: number;
  prev_page: number | null;
  next_page: number | null;
}

export interface APIResponse<T> {
  success: boolean;
  code: number;
  message?: string;
  data?: T;
  error?: Record<string, unknown>;
  meta?: MetaResponse;
}
