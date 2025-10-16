export enum UserRoleEnum {
  Customer = 'customer',
  Seller = 'seller'
}

export interface UserRegister {
  email: string;
  password: string;
  fname: string;
  lname: string;
  role: UserRoleEnum;
}

export interface UserLogin {
  email: string;
  password: string;
}

export type ApiStatus = 'success' | 'fail' | 'error';

export interface AuthResponse<T> {
  status: ApiStatus;
  message: string;
  token?: string;
  data?: T;
}

export interface User {
  _id: string;
  email: string;
  fname: string;
  lname: string;
  role: UserRoleEnum;
}

export type LoginResponse = AuthResponse<User>;
export type RegisterResponse = AuthResponse<User>;

// ==========================
// Password endpoints

export interface PasswordResponse {
  status: ApiStatus;
  message: string;
}
