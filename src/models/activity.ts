import type { TablePaginationConfig } from "antd";

export interface ActivityModel {
  id: string;
  name: string;
  date_of_activity: string;
  location: string;
  image?: string;
  path_image?: string;
}

export interface ActivityTableParams {
  pagination?: TablePaginationConfig;
  search?: string;
}

export const activityState: ActivityModel = {
  id: "",
  date_of_activity: "",
  location: "",
  name: "",
};
