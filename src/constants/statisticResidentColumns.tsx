import type { ColumnsType } from "antd/es/table";
import type { ResidentStatisticTableParams } from "../models/main/statistic";
import type { ResidentModel } from "../models/resident";
import { Tag } from "antd";

interface ColumnProps {
  tableParams: ResidentStatisticTableParams;
}

export const statisticResidentColumns = ({
  tableParams,
}: ColumnProps): ColumnsType<ResidentModel> => {
  return [
    {
      key: "no",
      title: "No.",
      width: "7%",
      render(_, __, index) {
        const page = tableParams.pagination?.current ?? 1;
        const pageSize = tableParams.pagination?.pageSize ?? 10;

        return (page - 1) * pageSize + index + 1;
      },
    },
    {
      key: "fullname",
      title: "Nama",
      dataIndex: "fullname",
      sorter: (a, b) => a.fullname.localeCompare(b.fullname),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "place_of_birth",
      title: "Tempat Lahir",
      dataIndex: "place_of_birth",
      sorter: (a, b) => a.place_of_birth.localeCompare(b.place_of_birth),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "address",
      title: "Alamat",
      dataIndex: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "profesion_status",
      title: "Status Bekerja",
      dataIndex: "profesion_status",
      render: (value) => {
        return (
          <Tag color={value === true ? "green" : "red"}>
            {value === true ? "Bekerja" : "Tidak Bekerj"}
          </Tag>
        );
      },
    },
  ];
};
