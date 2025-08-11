import type { TablePaginationConfig } from "antd";

export interface RWUnitModel {
  id: string;
  code: string;
  name_of_chairman: string;
}

export interface RWUnitTableParams {
  pagination?: TablePaginationConfig;
  search?: string;
}
