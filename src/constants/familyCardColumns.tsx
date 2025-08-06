import type { ColumnsType } from "antd/es/table";
import type {
  FamilyCardModel,
  FamilyCardTableParams,
} from "../models/familyCard";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { searchColumns } from "./searchColumns";
import { Link } from "react-router-dom";
import { statusFamilies, type ResidentModel } from "../models/resident";
import dayjs from "dayjs";
import type { EditableCellProps, EditableColumn } from "../models/global";

interface ColumnProps {
  tableParams: FamilyCardTableParams;
  setTableParams: (params: FamilyCardTableParams) => void;
  handleDelete: (id: string) => void;
  processing: boolean;
  editingRecord: FamilyCardModel | undefined;
  setEditingRecord: (data: FamilyCardModel | undefined) => void;
}

const familyCardColumns = ({
  handleDelete,
  editingRecord,
  processing,
  tableParams,
  setTableParams,
  setEditingRecord,
}: ColumnProps): EditableColumn<FamilyCardModel>[] => [
  {
    title: "ID Family",
    dataIndex: "family_id",
    editable: true,
    inputType: "text",
    key: "family_id",
    ...searchColumns<FamilyCardModel>("family id", (value) => {
      setTableParams({
        pagination: {
          ...tableParams.pagination,
        },
        filters: {
          ...tableParams.filters,
          family_id: value,
        },
      });
    }),
    sorter: (a, b) => a.family_id.localeCompare(b.family_id),
    sortDirections: ["ascend", "descend"],
    render: (value, record) => {
      return (
        <Link to={`/admin/family-card/${record?.id}`} className="text-blue-500">
          {value}
        </Link>
      );
    },
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    inputType: "text",
    editable: true,
    ...searchColumns<FamilyCardModel>("address", (value) => {
      setTableParams({
        pagination: {
          ...tableParams.pagination,
        },
        filters: {
          ...tableParams.filters,
          address: value,
        },
      });
    }),
    sorter: (a, b) => a.address.localeCompare(b.address),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Total Family",
    dataIndex: "total_family",
    key: "total_family",
    editable: true,
    width: "30%",
    inputType: "number",
  },
  {
    key: "action",
    title: "#",
    dataIndex: "id",
    align: "center",
    width: "10%",
    fixed: "right",
    render: (value, record) => {
      return editingRecord && editingRecord.id == record.id ? (
        <Space size="small" wrap>
          <Tooltip title="save">
            <Button
              type="link"
              htmlType="submit"
              icon={<SaveOutlined />}
              disabled={processing}
              loading={processing}
            />
          </Tooltip>
          <Popconfirm
            title="Sure to cancel?"
            onConfirm={() => setEditingRecord(undefined)}
          >
            <Tooltip title="cancel">
              <Button type="link" danger icon={<CloseOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ) : (
        <Space size="small" wrap>
          <Tooltip title="edit">
            <Button
              type="link"
              icon={<EditOutlined />}
              disabled={editingRecord != undefined || processing}
              htmlType="button"
              onClick={(e) => {
                e.preventDefault();
                setEditingRecord(record);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Confirm delete?"
            description={`Delete ${record.family_id}`}
            onConfirm={() => handleDelete(value)}
          >
            <Tooltip title="delete">
              <Button
                type="link"
                htmlType="button"
                danger
                icon={<DeleteOutlined />}
                disabled={processing}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      );
    },
  },
];

export const editTableFamilyCardColumns = (
  param: ColumnProps
): EditableColumn<FamilyCardModel>[] => {
  const isEditing = (record: FamilyCardModel) =>
    record.id === param.editingRecord?.id;

  return familyCardColumns(param).map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record): EditableCellProps<FamilyCardModel> => ({
        editing: isEditing(record),
        record,
        col,
      }),
    };
  });
};

export const residentFamilyColumns = (): ColumnsType<ResidentModel> => [
  {
    key: "resident_id",
    title: "ID Resident",
    dataIndex: "resident_id",
    sorter: (a, b) => a.resident_id.localeCompare(b.resident_id),
    sortDirections: ["ascend", "descend"],
  },
  {
    key: "family_card_id",
    title: "ID Family",
    render: (_, record) => {
      return record?.family_card?.family_id;
    },
    sorter: (a, b) => a.resident_id.localeCompare(b.resident_id),
    sortDirections: ["ascend", "descend"],
  },
  {
    key: "fullname",
    title: "Full Name",
    dataIndex: "fullname",
    sorter: (a, b) => a.resident_id.localeCompare(b.resident_id),
    sortDirections: ["ascend", "descend"],
  },
  {
    key: "place_of_birth",
    title: "Place Of Birth",
    dataIndex: "place_of_birth",
    sorter: (a, b) => a.place_of_birth.localeCompare(b.place_of_birth),
    sortDirections: ["ascend", "descend"],
    render: (value, record) => {
      return `${value}, ${dayjs(record.date_of_birth, "YYYY-MM-DD").format(
        "dddd, DD MMMM YYYY"
      )}`;
    },
  },
  {
    key: "family_status",
    title: "Family Status",
    dataIndex: "family_status",
    sorter: (a, b) => a.family_status.localeCompare(b.family_status),
    sortDirections: ["ascend", "descend"],
    render: (value) => {
      const status = statusFamilies.find((r) => r.value === value);

      return (
        <Tag
          color={
            status?.value == "father"
              ? "green"
              : status?.value == "mother"
              ? "blue"
              : "gold"
          }
        >
          {status?.label}
        </Tag>
      );
    },
  },
  {
    key: "profesion",
    title: "Profesion",
    dataIndex: "profesion",
    render: (value) => {
      return value ? value : "-";
    },
    sorter: (a, b) => a.profesion.localeCompare(b.profesion),
    sortDirections: ["ascend", "descend"],
  },
];
