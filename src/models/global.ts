import type { ColumnType } from "antd/es/table";
import type React from "react";
import type { JSX } from "react";

export interface Option {
  label: string;
  value: string;
}

export interface ErrorState {
  [key: string]: string;
}

export interface QueryParams {
  pageSize: number;
  current: number;
  filters?: Record<string, any>;
  id?: string;
}

export interface FormAppend {
  key: string;
  value: any;
  formData: FormData;
}

export interface Menu {
  key: string;
  icon: JSX.Element;
  label: string;
  path: string;
}

export interface Item {
  title?: string;
  items: Menu[];
}

export type inputType = "text" | "number" | "other" | "select";

export interface EditableColumn<T> extends ColumnType<T> {
  editable?: boolean;
  inputType?: inputType;
  inputRender?: () => React.ReactNode | undefined;
}

export interface EditableCellProps<T>
  extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  record: T;
  col: EditableColumn<T>;
  selectOptions?: { label: string; value: string }[];
}

export const religions = [
  {
    label: "Islam",
    value: "islam",
  },
  {
    label: "Kristen",
    value: "christian",
  },
  {
    label: "Katolik",
    value: "catholic",
  },
  {
    label: "Hindu",
    value: "hinduism",
  },
  {
    label: "Buddha",
    value: "buddhism",
  },
  {
    label: "Konghucu",
    value: "confucianism",
  },
];

export const genders = [
  {
    label: "Laki-Laki",
    value: "male",
  },
  {
    label: "Perempuan",
    value: "female",
  },
];

export const positions = [
  {
    label: "Kepala Desa",
    value: 1,
  },
  {
    label: "Sekretaris Desa",
    value: 2,
  },
  {
    label: "Kaur Keuangan",
    value: 3,
  },
  {
    label: "Kasi Pemerintahan",
    value: 4,
  },
  {
    label: "Kasi Kesejahteraan",
    value: 5,
  },
  {
    label: "Kasi Pelayanan",
    value: 6,
  },
  {
    label: "Kasi Umum ADM",
    value: 7,
  },
  {
    label: "Kasi Perencanaan",
    value: 8,
  },
];
