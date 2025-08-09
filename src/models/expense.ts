import type { TablePaginationConfig } from "antd";
import type { IncomeModel } from "./income";
import type { PeriodModel } from "./period";

export interface ExpenseModel {
  id: string;
  code: string;
  name: string;
  volume: number;
  unit: number;
  period_id: string;
  funding_source_id: string;
  amount: number;
  is_main: boolean;
  period: PeriodModel;
  income: IncomeModel;
}

export interface ExpenseFilter {
  code?: string;
  name?: string;
  period_id?: string;
}
export interface Statistic {
  year: number;
  total_expense: string;
}

export interface ExpenseTableParams {
  pagination?: TablePaginationConfig;
  filters?: ExpenseFilter;
}
