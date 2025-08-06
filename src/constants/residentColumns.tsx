import type { ColumnsType } from "antd/es/table";
import type { ResidentModel, ResidentTableParams } from "../models/resident";
import dayjs from "dayjs";
import { searchColumns, searchDateColumns } from "./searchColumns";
import { Button, Popconfirm, Space, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface ColumnProps {
  tableParams: ResidentTableParams;
  processing: boolean;
  setTableParams: (tableParams: ResidentTableParams) => void;
  handleDelete: (id: string) => void;
  handleEdit: (record: ResidentModel) => void;
}

export const residentColumns = ({
  tableParams,
  setTableParams,
  processing,
  handleDelete,
  handleEdit,
}: ColumnProps): ColumnsType<ResidentModel> => {
  const { t } = useTranslation();

  return [
    {
      key: "resident_id",
      title: t("residents.resident_id"),
      dataIndex: "resident_id",
      ...searchColumns<ResidentModel>("resident id", (value) => {
        setTableParams({
          pagination: {
            ...tableParams.pagination,
          },
          filters: {
            ...tableParams.filters,
            resident_id: value,
          },
        });
      }),
      sorter: (a, b) => a.resident_id.localeCompare(b.resident_id),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "family_card_id",
      title: t("residents.family_id"),
      render: (_, record) => {
        return record?.family_card?.family_id;
      },
      ...searchColumns<ResidentModel>("family card id", (value) => {
        setTableParams({
          pagination: {
            ...tableParams.pagination,
          },
          filters: {
            ...tableParams.filters,
            family_card_id: value,
          },
        });
      }),
      sorter: (a, b) => a.resident_id.localeCompare(b.resident_id),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "fullname",
      title: t("residents.fullname"),
      dataIndex: "fullname",
      ...searchColumns<ResidentModel>("fullname", (value) => {
        setTableParams({
          pagination: {
            ...tableParams.pagination,
          },
          filters: {
            ...tableParams.filters,
            fullname: value,
          },
        });
      }),
      sorter: (a, b) => a.resident_id.localeCompare(b.resident_id),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "place_of_birth",
      title: t("residents.place_of_birth"),
      dataIndex: "place_of_birth",
      ...searchColumns<ResidentModel>("place of birth", (value) => {
        setTableParams({
          pagination: {
            ...tableParams.pagination,
          },
          filters: {
            ...tableParams.filters,
            place_of_birth: value,
          },
        });
      }),
      sorter: (a, b) => a.place_of_birth.localeCompare(b.place_of_birth),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "date_of_birth",
      title: t("residents.date_of_birth"),
      dataIndex: "date_of_birth",
      render: (value) => {
        return dayjs(value, "YYYY-MM-DD").format("DD MMMM YYYY");
      },
      ...searchDateColumns<ResidentModel>("date of birth", (value) => {
        setTableParams({
          pagination: {
            ...tableParams.pagination,
          },
          filters: {
            ...tableParams.filters,
            date_of_birth: value,
          },
        });
      }),
      sorter: (a, b) => a.date_of_birth.localeCompare(b.date_of_birth),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "profesion",
      title: t("residents.profession"),
      dataIndex: "profesion",
      render: (value) => {
        return value ? value : "-";
      },
      ...searchColumns<ResidentModel>("profesion", (value) => {
        setTableParams({
          pagination: {
            ...tableParams.pagination,
          },
          filters: {
            ...tableParams.filters,
            profesion: value,
          },
        });
      }),
      sorter: (a, b) => a.profesion.localeCompare(b.profesion),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "action",
      title: "#",
      dataIndex: "id",
      align: "center",
      width: "10%",
      fixed: "right",
      render: (value, record) => {
        return (
          <Space size="small">
            <Tooltip title="Edit">
              <Button
                type="link"
                disabled={processing}
                onClick={() => handleEdit(record)}
              >
                <EditOutlined />
              </Button>
            </Tooltip>
            <Popconfirm
              title={`Confirm delete ${record?.resident_id}?`}
              onConfirm={() => handleDelete(value)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete">
                <Button danger type="link" disabled={processing}>
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
};
