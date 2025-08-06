import type { ColumnsType } from "antd/es/table";
import {
  status_letters,
  type IncomingLetterModel,
  type IncomingLetterTableParams,
} from "../models/incomingLetter";
import { useTranslation } from "react-i18next";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  searchColumns,
  searchDateColumns,
  selectFilterColumn,
} from "./searchColumns";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

interface ColumnProps {
  tableParams: IncomingLetterTableParams;
  processing: boolean;
  handleDelete: (id: string) => void;
  handleEdit: (record: IncomingLetterModel) => void;
  setTableParams: (params: IncomingLetterTableParams) => void;
}

export const incomingLetterColumns = ({
  handleDelete,
  handleEdit,
  processing,
  tableParams,
  setTableParams,
}: ColumnProps): ColumnsType<IncomingLetterModel> => {
  const { t } = useTranslation();

  return [
    {
      key: "code",
      title: t("incoming letters.code"),
      dataIndex: "code",
      ...searchColumns<IncomingLetterModel>("code", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            code: value,
          },
        });
      }),
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
      key: "regarding",
      title: t("incoming letters.regarding"),
      dataIndex: "regarding",
      ...searchColumns<IncomingLetterModel>("subject", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            regarding: value,
          },
        });
      }),
      sorter: (a, b) => a.regarding.localeCompare(b.regarding),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "date_of_receipt",
      title: t("incoming letters.date of receipt"),
      dataIndex: "date_of_receipt",
      ...searchDateColumns<IncomingLetterModel>("tanggal diterima", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            date_of_receipt: value,
          },
        });
      }),
      sorter: (a, b) => a.date_of_receipt.localeCompare(b.date_of_receipt),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        return dayjs(value, "YYYY-MM-DD").format("dddd, DD MMMM YYYY");
      },
    },
    {
      key: "date_of_letter",
      title: t("incoming letters.date of letter"),
      dataIndex: "date_of_letter",
      ...searchDateColumns<IncomingLetterModel>("tanggal surat", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            date_of_letter: value,
          },
        });
      }),
      sorter: (a, b) => a.date_of_letter.localeCompare(b.date_of_letter),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        return dayjs(value, "YYYY-MM-DD").format("dddd, DD MMMM YYYY");
      },
    },
    {
      key: "sender",
      title: t("incoming letters.sender"),
      dataIndex: "sender",
      ...searchColumns<IncomingLetterModel>("sender", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            sender: value,
          },
        });
      }),
      sorter: (a, b) => a.sender.localeCompare(b.sender),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "status_letter",
      title: t("incoming letters.status letter"),
      dataIndex: "status_letter",
      ...selectFilterColumn<IncomingLetterModel>(
        "status",
        status_letters,
        (value) => {
          setTableParams({
            ...tableParams,
            filters: {
              ...tableParams.filters,
              status_letter: value,
            },
          });
        }
      ),
      sorter: (a, b) => a.status_letter.localeCompare(b.status_letter),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        const status = status_letters.find((status) => status.value === value);
        return (
          <Tag
            color={
              status?.value === "read"
                ? "green"
                : value === "unread"
                ? "cyan"
                : "blue"
            }
          >
            {status?.label}
          </Tag>
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
