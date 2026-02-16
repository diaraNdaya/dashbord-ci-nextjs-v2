export interface ApiResponse<T> {
  data: T;
  status: boolean | number;
  success?: boolean;
  message?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiError {
  message: string;
  success?: boolean;
  status: number | boolean;
  code?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any;
}
