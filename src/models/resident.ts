import type { TablePaginationConfig } from "antd";
import type { FamilyCardModel } from "./familyCard";
import type { Option } from "./global";

export interface ResidentModel {
  id: string;
  resident_id: string;
  family_card_id: string;
  family_card: FamilyCardModel;
  fullname: string;
  gender: string;
  religion: string;
  citizen_status: string;
  place_of_birth: string;
  date_of_birth: string;
  family_status: string;
  profesion_status: boolean;
  profesion: string;
  region_id: string;
  address: string;
  image: string;
  path_image: string;
}

export interface ResidentFilters {
  resident_id?: string;
  family_card_id?: string;
  place_of_birth?: string;
  date_of_birth?: string;
  profesion?: string;
  fullname?: string;
}

export interface ResidentTableParams {
  pagination?: TablePaginationConfig;
  filters?: ResidentFilters;
}

export interface ProfesionStatistic {
  job: string;
  total: number;
}

export interface ReligionStatistic {
  name: string;
  total: number;
}

export const statusFamilies: Option[] = [
  {
    label: "Ayah",
    value: "father",
  },
  {
    label: "Ibu",
    value: "mother",
  },
  {
    label: "Anak",
    value: "child",
  },
];
