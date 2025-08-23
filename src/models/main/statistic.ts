import type { TablePaginationConfig } from "antd";

export interface ResidentStatisticTableParams {
  pagination?: TablePaginationConfig;
  search: string;
}

export interface JobStat {
  job: string;
  total: number;
}
