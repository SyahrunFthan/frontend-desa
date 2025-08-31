import type { TFunction } from "i18next";
import {
  status_submissions,
  type SubmissionServices,
  type SubmissionServiceTableParams,
} from "../models/submissionService";
import type { ColumnsType } from "antd/es/table";
import type { Dispatch, SetStateAction } from "react";
import {
  Button,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  type FormInstance,
} from "antd";
import { Link } from "react-router-dom";
import { searchColumns, searchDateColumns } from "./searchColumns";
import dayjs from "dayjs";
import RejectPopover from "../components/other/RejectPopover";
import { DeleteOutlined } from "@ant-design/icons";

interface ColumnProps {
  form: FormInstance;
  isHidden?: boolean;
  processing: boolean;
  setTableParams: Dispatch<SetStateAction<SubmissionServiceTableParams>>;
  tableParams: SubmissionServiceTableParams;
  t: TFunction;
  handleDelete: (id: string, note?: string) => void;
}

export const submissionServiceColumns = ({
  form,
  handleDelete,
  processing,
  tableParams,
  setTableParams,
  t,
  isHidden = false,
}: ColumnProps): ColumnsType<SubmissionServices> => {
  return [
    {
      key: "code",
      title: t("submissionService.code"),
      dataIndex: "code",
      sorter: (a, b) => {
        const compareA = a.code?.toLowerCase() || "";
        const compareB = b.code?.toLowerCase() || "";
        return compareA.localeCompare(compareB);
      },
      sortDirections: ["ascend", "descend"],
      ...searchColumns<SubmissionServices>("code", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            code: value,
          },
        });
      }),
      render: (value, record) => {
        if (value !== null) {
          return (
            <Link to={`/admin/submission-service/${record.id}`}>
              <Tag color="blue">{value}</Tag>
            </Link>
          );
        } else {
          return (
            <Link to={`/admin/submission-service/${record.id}`}>
              <Tag color="red">Belum Memiliki Nomor</Tag>
            </Link>
          );
        }
      },
    },
    {
      key: "resident_id",
      title: t("submissionService.resident_id"),
      dataIndex: ["resident", "fullname"],
      sorter: (a, b) => {
        const compareA = a.resident?.fullname.toLowerCase() || "";
        const compareB = b.resident?.fullname.toLowerCase() || "";
        return compareA.localeCompare(compareB);
      },
      sortDirections: ["ascend", "descend"],
      ...searchColumns<SubmissionServices>("name or nik", (value) => {
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
      key: "service_id",
      title: t("submissionService.service_id"),
      dataIndex: ["service", "name"],
      sorter: (a, b) => {
        const compareA = a.service?.name.toLowerCase() || "";
        const compareB = b.service?.name.toLowerCase() || "";
        return compareA.localeCompare(compareB);
      },
      sortDirections: ["ascend", "descend"],
      ...searchColumns<SubmissionServices>("name service", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            service_id: value,
          },
        });
      }),
    },
    {
      key: "note",
      title: t("submissionService.reason"),
      dataIndex: "note",
      sorter: (a, b) => {
        const compareA = a.note?.toLowerCase() || "";
        const compareB = b.note?.toLowerCase() || "";
        return compareA.localeCompare(compareB);
      },
      sortDirections: ["ascend", "descend"],
      hidden: isHidden,
    },
    {
      key: "status_submission",
      title: t("submissionService.status_submission"),
      dataIndex: "status_submission",
      sorter: (a, b) => {
        const compareA = a.status_submission.toLowerCase() || "";
        const compareB = b.status_submission.toLowerCase() || "";
        return compareA.localeCompare(compareB);
      },
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        const items = status_submissions.find((i) => i.value === value);

        return (
          <Tag
            color={
              value === "pending"
                ? "orange"
                : value === "approved"
                ? "green"
                : "red"
            }
          >
            {items?.label}
          </Tag>
        );
      },
    },
    {
      key: "date_of_submission",
      title: t("submissionService.date_of_submission"),
      dataIndex: "date_of_submission",
      sorter: (a, b) => {
        const compareA = a.date_of_submission.toLowerCase() || "";
        const compareB = b.date_of_submission.toLowerCase() || "";
        return compareA.localeCompare(compareB);
      },
      sortDirections: ["ascend", "descend"],
      ...searchDateColumns<SubmissionServices>("date", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            date_of_submission: value,
          },
        });
      }),
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
        if (record.status_submission === "pending") {
          return (
            <RejectPopover
              key={value}
              handleReject={handleDelete}
              id={value}
              form={form}
              processing={processing}
            />
          );
        } else {
          return (
            <Space size="small">
              <Popconfirm
                title={`Confirm delete ?`}
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
        }
      },
    },
  ];
};
