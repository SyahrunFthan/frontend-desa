import type { ColumnsType } from "antd/es/table";
import type {
  OutgoingLetterModel,
  OutgoingLetterTableParams,
} from "../models/outgoingLetter";
import type { TFunction } from "i18next";
import { searchColumns, searchDateColumns } from "./searchColumns";
import { Button, Popconfirm, Space, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

interface ColumnProps {
  tableParams: OutgoingLetterTableParams;
  processing: boolean;
  t: TFunction;
  setTableParams: (params: OutgoingLetterTableParams) => void;
  handleDelete: (id: string) => void;
  handleEdit: (record: OutgoingLetterModel) => void;
}

export const outgoingLetterColumns = ({
  tableParams,
  handleDelete,
  handleEdit,
  processing,
  setTableParams,
  t,
}: ColumnProps): ColumnsType<OutgoingLetterModel> => {
  return [
    {
      key: "code",
      title: t("outgoingLetters.code"),
      dataIndex: "code",
      ...searchColumns<OutgoingLetterModel>(
        t("outgoingLetters.code"),
        (value) => {
          setTableParams({
            ...tableParams,
            filters: {
              ...tableParams.filters,
              code: value,
            },
          });
        }
      ),
      sorter: (a, b) => a.code.localeCompare(b.code),
      sortDirections: ["ascend", "descend"],
      render: (value, record) => {
        return (
          <Link
            to={record.letter_path}
            className="text-blue-500"
            target="_blank"
          >
            {value}
          </Link>
        );
      },
    },
    {
      key: "date_of_letter",
      title: t("outgoingLetters.dateOfLetter"),
      dataIndex: "date_of_letter",
      ...searchDateColumns<OutgoingLetterModel>(
        t("outgoingLetters.dateOfLetter"),
        (value) => {
          setTableParams({
            ...tableParams,
            filters: {
              date_of_letter: value,
            },
          });
        }
      ),
      sorter: (a, b) => a.date_of_letter.localeCompare(b.date_of_letter),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        return dayjs(value, "YYYY-MM-DD").format("dddd, DD MMMM YYYY");
      },
    },
    {
      key: "objective",
      title: t("outgoingLetters.objective"),
      dataIndex: "objective",
      ...searchDateColumns<OutgoingLetterModel>(
        t("outgoingLetters.objective"),
        (value) => {
          setTableParams({
            ...tableParams,
            filters: {
              objective: value,
            },
          });
        }
      ),
      sorter: (a, b) => a.objective.localeCompare(b.objective),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "regarding",
      title: t("outgoingLetters.regarding"),
      dataIndex: "regarding",
      ...searchDateColumns<OutgoingLetterModel>(
        t("outgoingLetters.regarding"),
        (value) => {
          setTableParams({
            ...tableParams,
            filters: {
              regarding: value,
            },
          });
        }
      ),
      sorter: (a, b) => a.regarding.localeCompare(b.regarding),
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
              title={`Confirm delete ${record?.code}?`}
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
