import type { TablePaginationConfig } from "antd";

export interface IncomingLetterModel {
  id: string;
  code: string;
  date_of_letter: string;
  date_of_receipt: string;
  sender: string;
  regarding: string;
  summary: string;
  status_letter: string;
  letter_file: string;
  letter_path: string;
}

export interface IncomingLetterFilters {
  code?: string;
  date_of_letter?: string;
  date_of_receipt?: string;
  sender?: string;
  regarding?: string;
  status_letter?: string;
}

export interface IncomingLetterTableParams {
  pagination?: TablePaginationConfig;
  filters?: IncomingLetterFilters;
}

export const status_letters = [
  {
    label: "Dibaca",
    value: "read",
  },
  {
    label: "Belum Dibaca",
    value: "unread",
  },
  {
    label: "Arsip",
    value: "archived",
  },
];
