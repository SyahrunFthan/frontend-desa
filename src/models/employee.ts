import type { TablePaginationConfig } from "antd";

export interface EmployeeModel {
  id: string;
  employee_id: string;
  fullname: string;
  gender: string;
  religion: string;
  place_of_birth: string;
  date_of_birth: string;
  is_structure: boolean;
  position: string;
  level: number;
  path_image: string;
  image: string;
  signature_file: string;
  signature_path: string;
}

export interface EmployeeFilters {
  employee_id?: string;
  fullname?: string;
  gender?: string;
  religion?: string;
  date_of_birth?: string;
  position?: string;
}

export interface EmployeeTableParams {
  pagination?: TablePaginationConfig;
  filters?: EmployeeFilters;
}
