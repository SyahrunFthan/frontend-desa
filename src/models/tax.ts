import type { TablePaginationConfig } from "antd";
import type { Option } from "./global";
import type { ResidentModel } from "./resident";

export interface TaxModel {
  id: string;
  resident_id: string;
  reference_number: string;
  taxpayer_name: string;
  taxpayer_address: string;
  land_area: number;
  building_area: number;
  amount: number;
  status: string;
}

export interface Taxes extends TaxModel {
  resident?: ResidentModel;
}

export interface TaxFilter {
  reference_number?: string;
  resident_id?: string;
  taxpayer_name?: string;
  taxpayer_address?: string;
  status?: string;
}

export interface TaxTableParams {
  pagination?: TablePaginationConfig;
  filters?: TaxFilter;
}

export const taxState: TaxModel = {
  id: "",
  resident_id: "",
  reference_number: "",
  taxpayer_name: "",
  taxpayer_address: "",
  land_area: 0,
  building_area: 0,
  amount: 0,
  status: "",
};

export const status_payments: Option[] = [
  {
    label: "Lunas",
    value: "paid",
  },
  {
    label: "Belum Lunas",
    value: "unpaid",
  },
];
