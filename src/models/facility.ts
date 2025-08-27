import type { TablePaginationConfig } from "antd";
import type { Option } from "./global";

export interface FacilityModel {
  id: string;
  name: string;
  type_facility: string;
  latitude: number;
  longitude: number;
  description: string;
  status: string;
  region_id: string;
  image: string;
  path_image: string;
}

export interface FacilityTableParams {
  pagination?: TablePaginationConfig;
  search?: string;
}

export const facilityState: FacilityModel = {
  id: "",
  name: "",
  type_facility: "",
  latitude: 0,
  longitude: 0,
  description: "",
  status: "",
  region_id: "",
  image: "",
  path_image: "",
};

export const type_facilities: Option[] = [
  {
    label: "Pemerintahan",
    value: "government",
  },
  {
    label: "Kesehatan",
    value: "health",
  },
  {
    label: "Pendidikan",
    value: "education",
  },
  {
    label: "Rumah Ibadah",
    value: "house of worship",
  },
  {
    label: "Sosial",
    value: "social",
  },
  {
    label: "Ekonomi",
    value: "economy",
  },
  {
    label: "Lainnya",
    value: "other",
  },
];
