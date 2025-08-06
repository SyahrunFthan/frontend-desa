import type { TFunction } from "i18next";
import type { PeriodModel, PeriodTableParams } from "../models/period";
import type { EditableCellProps, EditableColumn } from "../models/global";
import { searchColumns } from "./searchColumns";
import { Button, Popconfirm, Space, Tooltip } from "antd";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";

interface ColumnProps {
  tableParams: PeriodTableParams;
  handleDelete: (id: string) => void;
  setEditingRecord: (record: PeriodModel | undefined) => void;
  setTableParams: (params: PeriodTableParams) => void;
  processing: boolean;
  editingRecord: PeriodModel | undefined;
  t: TFunction;
}

const periodColumns = ({
  editingRecord,
  handleDelete,
  processing,
  setEditingRecord,
  setTableParams,
  t,
  tableParams,
}: ColumnProps): EditableColumn<PeriodModel>[] => [
  {
    key: "no",
    title: "No.",
    render: (_, __, index) => {
      const pageSize = Number(tableParams.pagination?.pageSize);
      const current = Number(tableParams.pagination?.current);
      const start = (current - 1) * pageSize + index + 1;

      return start;
    },
    width: "5%",
    align: "center",
  },
  {
    key: "year",
    title: t("period.year"),
    dataIndex: "year",
    ...searchColumns<PeriodModel>("tahun", (value) => {
      setTableParams({
        ...tableParams,
        filters: {
          ...tableParams.filters,
          year: value,
        },
      });
    }),
    sorter: (a, b) => a.year.localeCompare(b.year),
    sortDirections: ["ascend", "descend"],
  },
  {
    key: "description",
    dataIndex: "description",
    title: t("period.description"),
    sorter: (a, b) => a.description.localeCompare(b.description),
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
            description={`Delete ${record.year}`}
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

export const editTablePeriodColumns = (
  param: ColumnProps
): EditableColumn<PeriodModel>[] => {
  const isEditing = (record: PeriodModel) =>
    record.id === param.editingRecord?.id;

  return periodColumns(param).map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record): EditableCellProps<PeriodModel> => ({
        editing: isEditing(record),
        record,
        col,
      }),
    };
  });
};
