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

export const employeeState: EmployeeModel = {
  date_of_birth: "",
  employee_id: "",
  fullname: "",
  gender: "",
  id: "",
  image: "",
  is_structure: false,
  level: 0,
  path_image: "",
  place_of_birth: "",
  position: "",
  religion: "",
  signature_file: "",
  signature_path: "",
};
