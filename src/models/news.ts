import type { TablePaginationConfig } from "antd";
import type { Option } from "./global";

export interface NewsModel {
  id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  date_of_issue: string;
  image: string;
  path_image: string;
  status: string;
}

export interface NewsTableParams {
  pagination?: TablePaginationConfig;
  search?: string;
}

export const status_news: Option[] = [
  {
    label: "Publish",
    value: "publish",
  },
  {
    label: "Unpublish",
    value: "unpublish",
  },
];
