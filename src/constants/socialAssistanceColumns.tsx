import type { Dispatch, SetStateAction } from "react";
import {
  monthOption,
  type SocialAssistance,
  type SocialAssistanceModel,
  type SocialAssistanceTableParams,
} from "../models/socialAssistance";
import type { ColumnsType } from "antd/es/table";
import type { TFunction } from "i18next";
import {
  searchColumns,
  searchDateColumns,
  selectFilterColumn,
} from "./searchColumns";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { status, type Option } from "../models/global";
import dayjs from "dayjs";

interface ColumnProps {
  tableParams: SocialAssistanceTableParams;
  setTableParams: Dispatch<SetStateAction<SocialAssistanceTableParams>>;
  handleDelete: (id: string) => void;
  handleEdit: (record: SocialAssistanceModel) => void;
  processing: boolean;
  t: TFunction;
  assistances: Option[];
}

export const socialAssistanceColumns = ({
  handleDelete,
  handleEdit,
  processing,
  setTableParams,
  tableParams,
  t,
  assistances,
}: ColumnProps): ColumnsType<SocialAssistance> => {
  return [
    {
      key: "resident_id",
      title: t("social_assistance.resident_id"),
      dataIndex: ["resident", "resident_id"],
      ...searchColumns<SocialAssistance>("name or resident id", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            resident_id: value,
          },
        });
      }),
      sorter: (a, b) =>
        a.resident?.fullname.localeCompare(b.resident?.fullname),
      sortDirections: ["ascend", "descend"],
      render: (value, record) => {
        return `${value} - ${record.resident.fullname}`;
      },
    },
    {
      key: "assistance_id",
      title: t("social_assistance.assistance_id"),
      dataIndex: ["assistance", "name"],
      ...selectFilterColumn<SocialAssistance>(
        "kategori",
        assistances,
        (value) => {
          setTableParams({
            ...tableParams,
            filters: {
              ...tableParams.filters,
              assistance_id: value,
            },
          });
        }
      ),
      sorter: (a, b) => a.assistance?.name.localeCompare(b.assistance?.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "status_assistance",
      title: t("social_assistance.status_assistance"),
      dataIndex: "status_assistance",
      ...selectFilterColumn<SocialAssistance>("status", status, (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            status_assistance: value,
          },
        });
      }),
      sorter: (a, b) => a.status_assistance.localeCompare(b.status_assistance),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        const item = status.find((item) => item.value === value);
        return (
          <Tag color={value === "active" ? "green" : "red"}>{item?.label}</Tag>
        );
      },
    },
    {
      key: "month_of_aid",
      title: t("social_assistance.month_of_aid"),
      dataIndex: "month_of_aid",
      ...selectFilterColumn<SocialAssistance>("bulan", monthOption, (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            month_of_aid: value,
          },
        });
      }),
      sorter: (a, b) => a.month_of_aid.localeCompare(b.month_of_aid),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "receipt_at",
      title: t("social_assistance.receipt_at"),
      dataIndex: "receipt_at",
      ...searchDateColumns<SocialAssistance>("tanggal", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            receipt_at: value,
          },
        });
      }),
      sorter: (a, b) => a.receipt_at.localeCompare(b.receipt_at),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        return dayjs(value, "YYYY-MM-DD").format("dddd, DD MMMM YYYY");
      },
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
              title={`Confirm delete ${record?.resident?.fullname}?`}
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
