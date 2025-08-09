import type { TablePaginationConfig } from "antd";
import type { PeriodModel } from "./period";

export interface IncomeModel {
  id: string;
  period_id: string;
  code: string;
  name: string;
  abbreviation: string;
  amount: number;
  period: PeriodModel;
}

export interface Statistic {
  year: number;
  total_income: string;
}

export interface IncomeFilters {
  period_id?: string;
  code?: string;
  name?: string;
  abbreviation?: string;
  amount?: number;
}

export interface IncomeTableParams {
  pagination?: TablePaginationConfig;
  filters?: IncomeFilters;
}
