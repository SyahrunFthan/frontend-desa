import type { TablePaginationConfig } from "antd";

export interface PeriodModel {
  id: string;
  year: number;
  description: string;
  file?: string;
  path_file?: string;
}

export interface PeriodFilters {
  year?: string;
}

export interface PeriodTableParams {
  pagination?: TablePaginationConfig;
  filters?: PeriodFilters;
}
