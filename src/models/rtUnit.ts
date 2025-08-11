import type { TablePaginationConfig } from "antd";
import type { RWUnitModel } from "./rwUnit";

export interface RTUnitModel {
  id: string;
  code: string;
  name_of_chairman: string;
  rw_id: string;
}

export interface RTUnitExtends extends RTUnitModel {
  rw_unit: RWUnitModel;
}

export interface RTUnitTableParams {
  pagination?: TablePaginationConfig;
  search?: string;
}
