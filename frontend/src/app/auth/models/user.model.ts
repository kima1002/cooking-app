export interface User {
  _id?: string;
  email: string;
  name: string;
  surname?: string;
  bio?: string;
  personality?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}