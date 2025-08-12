import type { TablePaginationConfig } from "antd";
import type { Option } from "./global";

export interface ServiceModel {
  id: string;
  name: string;
  type_service: string;
  status_service: string;
  template_path: string;
  template_file: string;
}

export interface ServiceFilter {
  name?: string;
  type_service?: string;
  status_service?: string;
}

export interface ServiceTableParams {
  pagination?: TablePaginationConfig;
  filters?: ServiceFilter;
}

export const typeServices: Option[] = [
  {
    label: "Umum",
    value: "general",
  },
  {
    label: "Penduduk",
    value: "resident",
  },
  {
    label: "Pernikahan",
    value: "wedding",
  },
  {
    label: "Pertanahan",
    value: "land",
  },
  {
    label: "Lainnya",
    value: "other",
  },
];
