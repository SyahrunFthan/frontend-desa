import type { TablePaginationConfig } from "antd";
import type { NewsModel } from "./news";
import type { Users } from "./user";

export interface CommentNewsModel {
  id: string;
  news_id: string;
  user_id: string;
  comment: string;
}

export interface CommentNews extends CommentNewsModel {
  news?: NewsModel;
  user?: Users;
}

export interface CommentNewsTableParams {
  pagination?: TablePaginationConfig;
  search?: string;
}
