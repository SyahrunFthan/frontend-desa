import type { TablePaginationConfig } from "antd";
import type { Option } from "./global";

export interface DevelopmentModel {
  id: string;
  name: string;
  volume: string;
  budget: number;
  source_of_fund: string;
  latitude: number;
  longitude: number;
  start_at: string;
  end_at: string;
  status: string;
  year: number;
}

export interface DevelopmentFilter {
  name?: string;
  volume?: string;
  source_of_fund?: string;
  status?: string;
  start_at?: string;
  end_at?: string;
}

export interface DevelopmentTableParams {
  pagination?: TablePaginationConfig;
  filters?: DevelopmentFilter;
}

export const developmentState: DevelopmentModel = {
  id: "",
  budget: 0,
  end_at: "",
  latitude: 0,
  longitude: 0,
  name: "",
  source_of_fund: "",
  start_at: "",
  status: "",
  volume: "",
  year: 0,
};

export const statusWorks: Option[] = [
  {
    label: "Start",
    value: "start",
  },
  {
    label: "Proses",
    value: "process",
  },
  {
    label: "Selesai",
    value: "finish",
  },
];
