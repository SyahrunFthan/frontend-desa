import type { TablePaginationConfig } from "antd";
import type { ResidentModel } from "./resident";
import type { ServiceModel } from "./service";
import type { Option } from "./global";

export interface SubmissionServiceModel {
  id: string;
  resident_id: string;
  service_id: string;
  is_signed: boolean;
  status_submission: string;
  note: string | null;
  submission_file: string;
  submission_path: string;
  code: string | null;
  date_of_submission: string;
}

export interface SubmissionServices extends SubmissionServiceModel {
  resident?: ResidentModel;
  service?: ServiceModel;
}

export interface SubmissionServiceFilter {
  code?: string;
  resident_id?: string;
  service_id?: string;
  date_of_submission?: string;
}

export interface SubmissionServiceTableParams {
  pagination?: TablePaginationConfig;
  filters?: SubmissionServiceFilter;
}

export const status_submissions: Option[] = [
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Approved",
    value: "approved",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
];
