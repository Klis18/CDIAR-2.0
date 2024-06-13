import { User } from './user.interface';

export interface Login {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
