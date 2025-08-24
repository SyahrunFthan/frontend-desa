import type { TablePaginationConfig } from "antd";

export interface ResidentStatisticTableParams {
  pagination?: TablePaginationConfig;
  search: string;
}

export interface JobStat {
  job: string;
  total: number;
}

export interface GenderData {
  name: string;
  value: number;
  count: number;
}

export interface ReligionData {
  name: string;
  value: string;
  count: number;
  percentage: number;
}

export interface AgeGroupData {
  ageRange: string;
  category: string;
  count: number;
  percentage: number;
  male: number;
  female: number;
}
