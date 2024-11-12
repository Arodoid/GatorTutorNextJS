/**
 * Auth Types
 * 
 * These types define the shape of our auth-related data structures.
 * They're used throughout the app to ensure type safety when handling
 * user registration, login, and user data.
 */

/**
 * Registration Form Data
 * 
 * What we collect when someone signs up:
 * - email: Their email address
 * - password: Their chosen password
 * - confirmPassword: Password verification
 * - acceptTerms: Did they agree to terms?
 */
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

/**
 * Login Response
 * 
 * What the server sends back after a login attempt:
 * - success: Did it work?
 * - message: Success/error message
 * - user?: User data (only if successful)
 * - token?: JWT token (only if successful)
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    email: string;
  };
  token?: string;
}

/**
 * Safe User Data
 * 
 * A user object without sensitive data (no password!)
 * Used when we need to pass user data around the app
 */
export interface UserWithoutPassword {
  id: number;
  email: string;
}
