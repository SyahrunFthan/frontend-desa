import type { TablePaginationConfig } from "antd";
import type { ResidentModel } from "./resident";

export interface FamilyCardModel {
  id: string;
  family_id: string;
  address: string;
  total_family: number;
}

export interface FamilyCards extends FamilyCardModel {
  residents?: ResidentModel[];
}

export interface FamilyCardFilter {
  family_id?: string;
  address?: string;
}

export interface FamilyCardTableParams {
  pagination?: TablePaginationConfig;
  filters?: FamilyCardFilter;
}
