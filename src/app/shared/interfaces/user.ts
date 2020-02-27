export interface User {
  _id?: string;
  name?: string;
  email: string;
  password: string;
  token?: string;
  avatar?: any;
  role?: string;
  createdAt?: string;
}
