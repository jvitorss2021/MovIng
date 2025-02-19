import { AxiosError } from 'axios';

export interface ApiError {
  error: string;
  status?: number;
}

export interface ApiErrorResponse {
  response?: {
    status: number;
    data: ApiError;
  };
}

export type ApiAxiosError = AxiosError<ApiError>; 