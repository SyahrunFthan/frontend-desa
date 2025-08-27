import type { ColumnsType } from "antd/es/table";
import type { RegionModel, RegionTableParams } from "../models/region";
import type { TFunction } from "i18next";
import { Button, Popconfirm, Space, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

interface ColumnProps {
  tableParams: RegionTableParams;
  handleDelete: (id: string) => void;
  handleEdit: (record: RegionModel) => void;
  t: TFunction;
  processing: boolean;
}

export const regionColumns = ({
  handleDelete,
  handleEdit,
  t,
  tableParams,
  processing,
}: ColumnProps): ColumnsType<RegionModel> => {
  return [
    {
      key: "no",
      title: "No.",
      render: (_, __, index) => {
        const page = tableParams.pagination?.current || 1;
        const pageSize = tableParams.pagination?.pageSize || 5;

        return (page - 1) * pageSize + index + 1;
      },
      width: "7%",
    },
    {
      key: "name",
      title: t("region.name"),
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      render: (value, record) => {
        return (
          <Link to={`/admin/region/${record.id}`} className="text-blue-500">
            {value}
          </Link>
        );
      },
    },
    {
      key: "leader_id",
      title: t("region.leader"),
      dataIndex: ["leader", "fullname"],
      sorter: (a, b) => a.leader?.fullname.localeCompare(b.leader?.fullname),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "land_area",
      title: t("region.land_area"),
      dataIndex: "land_area",
      sorter: (a, b) => a.land_area.localeCompare(b.land_area),
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
