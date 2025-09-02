import type { TablePaginationConfig } from "antd";
import type { ResidentModel } from "./resident";
import type { StallCategoryModel } from "./stallCategory";

export interface StallModel {
  id: string;
  resident_id: string;
  category_id: string;
  name: string;
  price: number;
  description: string;
  phone_number: string;
  image: string;
  path_image: string;
  status: string;
}

export interface Stalls extends StallModel {
  resident?: ResidentModel;
  category?: StallCategoryModel;
}

export interface StallFilter {
  resident_id?: string;
  category_id?: string;
  name?: string;
  phone_number?: string;
  status?: string;
}

export interface StallTableParams {
  pagination?: TablePaginationConfig;
  filters?: StallFilter;
}
