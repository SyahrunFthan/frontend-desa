import type { TablePaginationConfig } from "antd";

export interface StallCategoryModel {
  id: string;
  name: string;
  icon_file: string;
  icon_path: string;
}

export interface StallCategoryTableParams {
  pagination?: TablePaginationConfig;
  search?: string;
}
