import type { TablePaginationConfig } from "antd";
import type { RoleModel } from "./role";
import type { ResidentModel } from "./resident";

export interface UserModel {
  id: string;
  email: string;
  username: string;
  password: string;
  role_id: string;
  role: RoleModel;
  resident_id: string;
}

export interface Users extends UserModel {
  resident?: ResidentModel;
}

export interface UserForm {
  email: string;
  username: string;
  role_id: string;
  resident_id: string;
}
export interface UserUpdateForm {
  email: string;
  username: string;
  role_id: string;
  id: string;
}

export interface UserFilters {
  username?: string;
  email?: string;
}

export interface UserTableParams {
  pagination?: TablePaginationConfig;
  filters?: UserFilters;
}
