import type { TFunction } from "i18next";
import {
  status_news,
  type NewsModel,
  type NewsTableParams,
} from "../models/news";
import type { ColumnsType } from "antd/es/table";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import type {
  CommentNews,
  CommentNewsTableParams,
} from "../models/commentNews";

interface ColumnProps {
  tableParams: NewsTableParams;
  processing: boolean;
  t: TFunction;
  handleDelete: (id: string) => void;
  handleEdit: (record: NewsModel) => void;
}

export const newsColumns = ({
  handleDelete,
  handleEdit,
  processing,
  t,
  tableParams,
}: ColumnProps): ColumnsType<NewsModel> => {
  return [
    {
      key: "no",
      title: "No.",
      width: "7%",
      render: (_, __, index) => {
        const page = tableParams.pagination?.current || 1;
        const pageSize = tableParams.pagination?.pageSize || 10;
        return (page - 1) * pageSize + index + 1;
      },
    },
    {
      key: "title",
      title: t("news.title_news"),
      dataIndex: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortDirections: ["ascend", "descend"],
      render: (value, record) => {
        return (
          <Link className="text-blue-500" to={`/admin/news/${record.id}`}>
            {value}
          </Link>
        );
      },
    },
    {
      key: "author",
      title: t("news.author"),
      dataIndex: "author",
      sorter: (a, b) => a.author.localeCompare(b.author),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "date_of_issue",
      title: t("news.date_of_issue"),
      dataIndex: "date_of_issue",
      sorter: (a, b) => a.date_of_issue.localeCompare(b.date_of_issue),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        return dayjs(value, "YYYY-MM-DD").format("dddd, DD MMMM YYYY");
      },
    },
    {
      key: "status",
      title: t("news.status"),
      dataIndex: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        const items = status_news.find((item) => item.value === value);

        return (
          <Tag color={value === "publish" ? "green" : "red"}>
            {items?.label}
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
              title={`Confirm delete ${record?.title}?`}
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

interface CommentColumnProps {
  tableParams: CommentNewsTableParams;
  t: TFunction;
  processing: boolean;
  handleDelete: (id: string) => void;
}

export const commentNewsColumns = ({
  handleDelete,
  processing,
  t,
  tableParams,
}: CommentColumnProps): ColumnsType<CommentNews> => {
  return [
    {
      key: "no",
      title: "No.",
      width: "7%",
      render: (_, __, index) => {
        const page = tableParams.pagination?.current || 1;
        const pageSize = tableParams.pagination?.pageSize || 10;
        return (page - 1) * pageSize + index + 1;
      },
    },
    {
      key: "title",
      title: t("news.title_news"),
      dataIndex: ["news", "title"],
      sorter: (a, b) => {
        const titleA = a.news?.title ?? "";
        const titleB = b.news?.title ?? "";
        return titleA.localeCompare(titleB);
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "user",
      title: t("residents.fullname"),
      dataIndex: ["user", "resident", "fullname"],
      sorter: (a, b) => {
        const titleA = a.user?.resident?.fullname ?? "";
        const titleB = b.user?.resident?.fullname ?? "";

        return titleA.localeCompare(titleB);
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "comment",
      title: t("news.detail.comment.title"),
      dataIndex: "comment",
      sorter: (a, b) => {
        const titleA = a.comment;
        const titleB = b.comment;

        return titleA.localeCompare(titleB);
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "action",
      title: "#",
      dataIndex: "id",
      align: "center",
      width: "10%",
      fixed: "right",
      render: (value) => {
        return (
          <Space size="small">
            <Popconfirm
              title={`Confirm delete?`}
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
