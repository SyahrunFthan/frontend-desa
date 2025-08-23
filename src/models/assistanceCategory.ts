import type { TablePaginationConfig } from "antd";
import type { Option } from "./global";

export interface AssistanceCategoryModel {
  id: string;
  name: string;
  description: string;
  type_assistance: string;
  amount: number;
  status: string;
  year: number;
}

export interface AssistanceCategoryTableParams {
  pagination?: TablePaginationConfig;
  search?: string;
}

export const assistanceCategoryState: AssistanceCategoryModel = {
  amount: 0,
  description: "",
  id: "",
  name: "",
  status: "",
  type_assistance: "",
  year: 0,
};

export const typeAssistances: Option[] = [
  {
    label: "Uang",
    value: "cash",
  },
  {
    label: "Sembako",
    value: "basic good",
  },
];
