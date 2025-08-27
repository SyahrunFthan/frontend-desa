import type { TablePaginationConfig } from "antd";
import type { EmployeeModel } from "./employee";

export interface RegionModel {
  id: string;
  leader_id: string;
  name: string;
  geo_json: string;
  color: string;
  land_area: string;
  leader: EmployeeModel;
  createdAt?: string;
}

export interface RegionTableParams {
  pagination?: TablePaginationConfig;
  search?: string;
}
