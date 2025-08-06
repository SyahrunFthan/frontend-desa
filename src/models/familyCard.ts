import type { TablePaginationConfig } from "antd";

export interface FamilyCardModel {
  id: string;
  family_id: string;
  address: string;
  total_family: number;
}

export interface FamilyCardFilter {
  family_id?: string;
  address?: string;
}

export interface FamilyCardTableParams {
  pagination?: TablePaginationConfig;
  filters?: FamilyCardFilter;
}
