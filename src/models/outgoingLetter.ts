import type { TablePaginationConfig } from "antd";
import type { Option } from "./global";

export interface OutgoingLetterModel {
  id: string;
  code: string;
  date_of_letter: string;
  objective: string;
  regarding: string;
  summary: string;
  status_letter: string;
  letter_file: string;
  letter_path: string;
}

export interface OutgoingLetterFilters {
  code?: string;
  date_of_letter?: string;
  objective?: string;
  regarding?: string;
  status_letter?: string;
}

export interface OutgoingLetterTableParams {
  pagination?: TablePaginationConfig;
  filters?: OutgoingLetterFilters;
}

export const outgoingStatusLetters: Option[] = [
  {
    label: "Arsip",
    value: "archived",
  },
  {
    label: "Terkirim",
    value: "sending",
  },
  {
    label: "Proses",
    value: "process",
  },
];
