import type { Dispatch, SetStateAction } from "react";
import type { Stalls, StallTableParams } from "../models/stall";
import type { TFunction } from "i18next";
import type { ColumnsType } from "antd/es/table";
import { searchColumns, selectFilterColumn } from "./searchColumns";
import { status } from "../models/global";
import { Button, Popconfirm, Space, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type {
  StallCategoryModel,
  StallCategoryTableParams,
} from "../models/stallCategory";

interface StallColumnProps {
  tableParams: StallTableParams;
  setTableParams: Dispatch<SetStateAction<StallTableParams>>;
  processing: boolean;
  t: TFunction;
  handleDelete: (id: string) => void;
}

export const stallColumns = (params: StallColumnProps): ColumnsType<Stalls> => {
  const { tableParams, setTableParams, processing, t, handleDelete } = params;

  return [
    {
      key: "resident_id",
      title: t("stall.resident_id"),
      dataIndex: ["resident", "fullname"],
      sorter: (a, b) => {
        const compareA = a.resident?.fullname.toLowerCase() || "";
        const compareB = b.resident?.fullname.toLowerCase() || "";
        return compareA.localeCompare(compareB);
      },
      sortDirections: ["ascend", "descend"],
      ...searchColumns<Stalls>("name or nik", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            resident_id: value,
          },
        });
      }),
    },
    {
      key: "category_id",
      title: t("stall.category_id"),
      dataIndex: ["category", "name"],
      sorter: (a, b) => {
        const compareA = a.category?.name.toLowerCase() || "";
        const compareB = b.category?.name.toLowerCase() || "";
        return compareA.localeCompare(compareB);
      },
      sortDirections: ["ascend", "descend"],
      ...searchColumns<Stalls>("category", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            category_id: value,
          },
        });
      }),
    },
    {
      key: "name",
      title: t("stall.name"),
      dataIndex: ["category", "name"],
      sorter: (a, b) => {
        const compareA = a.name.toLowerCase() || "";
        const compareB = b.name.toLowerCase() || "";
        return compareA.localeCompare(compareB);
      },
      sortDirections: ["ascend", "descend"],
      ...searchColumns<Stalls>("category", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            name: value,
          },
        });
      }),
    },
    {
      key: "status",
      title: t("stall.status"),
      dataIndex: ["status"],
      sorter: (a, b) => {
        const compareA = a.status.toLowerCase() || "";
        const compareB = b.status.toLowerCase() || "";
        return compareA.localeCompare(compareB);
      },
      sortDirections: ["ascend", "descend"],
      ...selectFilterColumn<Stalls>("status", status, (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            status: value,
          },
        });
      }),
    },
    {
      key: "phone_number",
      title: t("stall.phone_number"),
      dataIndex: ["phone_number"],
      sorter: (a, b) => {
        const compareA = a.phone_number.toLowerCase() || "";
        const compareB = b.phone_number.toLowerCase() || "";
        return compareA.localeCompare(compareB);
      },
      sortDirections: ["ascend", "descend"],
      ...searchColumns<Stalls>("phone_number", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            phone_number: value,
          },
        });
      }),
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
          <Popconfirm
            title={`Confirm delete ${record?.name}?`}
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
        );
      },
    },
  ];
};

interface StallCategoryColumnProps {
  tableParams: StallCategoryTableParams;
  processing: boolean;
  t: TFunction;
  handleDelete: (id: string) => void;
  handleEdit: (record: StallCategoryModel) => void;
}

export const stallCategoryColumns = (
  params: StallCategoryColumnProps
): ColumnsType<StallCategoryModel> => {
  const { tableParams, t, handleDelete, handleEdit, processing } = params;

  return [
    {
      key: "no",
      title: "No.",
      render: (_, __, index) => {
        const page = tableParams.pagination?.current;
        const pageSize = tableParams.pagination?.pageSize;

        return (page! - 1) * pageSize! + index + 1;
      },
      width: "7%",
    },
    {
      key: "name",
      title: t("stall_category.name"),
      dataIndex: "name",
      sorter: (a, b) => {
        const compareA = a.name.toLowerCase();
        const compareB = b.name.toLowerCase();
        return compareA.localeCompare(compareB);
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "icon",
      title: t("stall_category.icon"),
      dataIndex: "icon_path",
      render: (value) => {
        return (
          <img src={value} className="w-16 h-16 rounded-md object-cover" />
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
              title={`Confirm delete ${record?.name}?`}
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
