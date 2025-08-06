import type { TablePaginationConfig } from "antd";

export interface RoleModel {
  id?: string;
  name: string;
  key: string;
}

export interface RoleForm {
  name: string;
  key: string;
}

export interface RoleTableParams {
  pagination?: TablePaginationConfig;
}
