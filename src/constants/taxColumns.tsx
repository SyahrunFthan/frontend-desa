import type { Dispatch, SetStateAction } from "react";
import {
  status_payments,
  type Taxes,
  type TaxModel,
  type TaxTableParams,
} from "../models/tax";
import type { TFunction } from "i18next";
import type { ColumnsType } from "antd/es/table";
import { searchColumns, selectFilterColumn } from "./searchColumns";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface ColumnProps {
  tableParams: TaxTableParams;
  processing: boolean;
  setTableParams: Dispatch<SetStateAction<TaxTableParams>>;
  t: TFunction;
  handleDelete: (id: string) => void;
  handleEdit: (record: TaxModel) => void;
}

export const taxColumns = ({
  handleDelete,
  handleEdit,
  processing,
  setTableParams,
  tableParams,
  t,
}: ColumnProps): ColumnsType<Taxes> => {
  return [
    {
      key: "reference_number",
      title: t("tax.reference_number"),
      dataIndex: "reference_number",
      ...searchColumns<Taxes>("reference number", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            reference_number: value,
          },
        });
      }),
      sorter: (a, b) => a.reference_number.localeCompare(b.reference_number),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "taxpayer_name",
      title: t("tax.taxpayer_name"),
      dataIndex: "taxpayer_name",
      ...searchColumns<Taxes>("taxpayer name", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            taxpayer_name: value,
          },
        });
      }),
      sorter: (a, b) => a.taxpayer_name.localeCompare(b.taxpayer_name),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "resident_id",
      title: t("tax.resident_id"),
      dataIndex: ["resident", "fullname"],
      ...searchColumns<Taxes>("name or nik", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            resident_id: value,
          },
        });
      }),
      sorter: (a, b) => a.resident_id.localeCompare(b.resident_id),
      sortDirections: ["ascend", "descend"],
      render: (value, record) => {
        return `${record.resident?.resident_id} - ${value}`;
      },
    },
    {
      key: "taxpayer_address",
      title: t("tax.taxpayer_address"),
      dataIndex: "taxpayer_address",
      ...searchColumns<Taxes>("taxpayer address", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            taxpayer_address: value,
          },
        });
      }),
      sorter: (a, b) => a.taxpayer_address.localeCompare(b.taxpayer_address),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "status",
      title: t("tax.status"),
      dataIndex: "status",
      ...selectFilterColumn<Taxes>(
        "taxpayer address",
        status_payments,
        (value) => {
          setTableParams({
            ...tableParams,
            filters: {
              ...tableParams.filters,
              status: value,
            },
          });
        }
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        const item = status_payments.find((i) => i.value === value);

        return (
          <Tag color={value === "paid" ? "green" : "red"}>{item?.label}</Tag>
        );
      },
    },
    {
      key: "amount",
      title: t("tax.amount"),
      dataIndex: "amount",
      sorter: (a, b) => a.amount - b.amount,
      sortDirections: ["ascend", "descend"],
      render: (value, record) => {
        return (
          <div className="flex flex-col">
            <span>Rp {value.toLocaleString()}</span>
            <span>Luas Tanah: {record.land_area} m2</span>
            <span>Luas Bangunan: {record.building_area} m2</span>
          </div>
        );
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
              title={`Confirm delete ${record?.reference_number}?`}
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
