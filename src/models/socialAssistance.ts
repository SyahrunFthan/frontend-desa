import type { TablePaginationConfig } from "antd";
import type { ResidentModel } from "./resident";
import type { AssistanceCategoryModel } from "./assistanceCategory";
import type { Option } from "./global";

export interface SocialAssistanceModel {
  id: string;
  resident_id: string;
  assistance_id: string;
  status_assistance: string;
  month_of_aid: string;
  receipt_at: string;
}

export interface SocialAssistance extends SocialAssistanceModel {
  resident: ResidentModel;
  assistance: AssistanceCategoryModel;
}

export interface SocialAssistanceFilter {
  resident_id?: string;
  assistance_id?: string;
  status_assistance?: string;
  month_of_aid?: string;
  receipt_at?: string;
}

export interface SocialAssistanceTableParams {
  pagination?: TablePaginationConfig;
  filters?: SocialAssistanceFilter;
}

export const socialAssistanceState: SocialAssistanceModel = {
  assistance_id: "",
  id: "",
  month_of_aid: "",
  receipt_at: "",
  resident_id: "",
  status_assistance: "",
};

export const monthOption: Option[] = [
  { label: "Januari", value: "Januari" },
  { label: "Februari", value: "Februari" },
  { label: "Maret", value: "Maret" },
  { label: "April", value: "April" },
  { label: "Mei", value: "Mei" },
  { label: "Juni", value: "Juni" },
  { label: "Juli", value: "Juli" },
  { label: "Agustus", value: "Agustus" },
  { label: "September", value: "September" },
  { label: "Oktober", value: "Oktober" },
  { label: "November", value: "November" },
  { label: "Desember", value: "Desember" },
];
