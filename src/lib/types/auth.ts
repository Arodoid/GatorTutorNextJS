export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    email: string;
  };
  token?: string;
}

export interface UserWithoutPassword {
  id: number;
  email: string;
}
