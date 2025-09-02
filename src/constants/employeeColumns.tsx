import type { ColumnsType } from "antd/es/table";
import type { EmployeeModel, EmployeeTableParams } from "../models/employee";
import {
  searchColumns,
  searchDateColumns,
  selectFilterColumn,
} from "./searchColumns";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { religions } from "../models/global";
import type { Dispatch, SetStateAction } from "react";
import EmployeeSignatureUpload from "../components/employees/EmployeeSignatureUpload";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";

interface ColumnProps {
  tableParams: EmployeeTableParams;
  setTableParams: Dispatch<SetStateAction<EmployeeTableParams>>;
  processing: boolean;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  handleDelete: (id: string) => void;
  handleEdit: (record: EmployeeModel) => void;
  fetchData: () => void;
}

export const employeeColumns = ({
  handleDelete,
  handleEdit,
  processing,
  setTableParams,
  tableParams,
  messageApi,
  fetchData,
  notificationApi,
}: ColumnProps): ColumnsType<EmployeeModel> => [
  {
    key: "employee_id",
    title: "ID Employee",
    dataIndex: "employee_id",
    ...searchColumns<EmployeeModel>("Employee ID", (value) => {
      setTableParams({
        ...tableParams,
        filters: {
          ...tableParams.filters,
          employee_id: value,
        },
      });
    }),
    sorter: (a, b) => a.employee_id.localeCompare(b.employee_id),
    sortDirections: ["ascend", "descend"],
  },
  {
    key: "fullname",
    title: "Full Name",
    dataIndex: "fullname",
    ...searchColumns<EmployeeModel>("full name", (value) => {
      setTableParams({
        ...tableParams,
        filters: {
          ...tableParams.filters,
          fullname: value,
        },
      });
    }),
    sorter: (a, b) => a.fullname.localeCompare(b.fullname),
    sortDirections: ["ascend", "descend"],
  },
  {
    key: "date_of_birth",
    title: "TTL",
    dataIndex: "date_of_birth",
    ...searchDateColumns<EmployeeModel>("date of birth", (value) => {
      setTableParams({
        ...tableParams,
        filters: {
          ...tableParams.filters,
          date_of_birth: value,
        },
      });
    }),
    render: (value, record) => {
      return `${record.place_of_birth}, ${dayjs(value, "YYYY-MM-DD").format(
        "DD MMMM YYYY"
      )}`;
    },
    sorter: (a, b) => a.fullname.localeCompare(b.fullname),
    sortDirections: ["ascend", "descend"],
  },
  {
    key: "gender",
    title: "Gender",
    dataIndex: "gender",
    render: (value) => {
      return `${value == "male" ? "Laki-Laki" : "Perempuan"}`;
    },
    sorter: (a, b) => a.gender.localeCompare(b.gender),
    sortDirections: ["ascend", "descend"],
    ...selectFilterColumn<EmployeeModel>(
      "gender",
      [
        { label: "Laki-Laki", value: "male" },
        { label: "Perempuan", value: "female" },
      ],
      (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            gender: value,
          },
        });
      }
    ),
  },
  {
    key: "is_structure",
    title: "Aparatur?",
    dataIndex: "is_structure",
    render: (value) => (
      <Tag color={value ? "green" : "error"}>{value ? "Ya" : "Tidak"}</Tag>
    ),
    filters: [
      { text: "Ya", value: true },
      { text: "Tidak", value: false },
    ],
    onFilter: (value, record) => record.is_structure === value,
  },
  {
    key: "position",
    title: "Position",
    dataIndex: "position",
    ...searchColumns<EmployeeModel>("position", (value) => {
      setTableParams({
        ...tableParams,
        filters: {
          ...tableParams.filters,
          position: value,
        },
      });
    }),
    sorter: (a, b) => a.position.localeCompare(b.position),
    sortDirections: ["ascend", "descend"],
  },
  {
    key: "religion",
    title: "Religion",
    dataIndex: "religion",
    render: (value) => {
      const religion = religions.map(
        (item) => item.value === value && item.label
      );

      return religion;
    },
    sorter: (a, b) => a.religion.localeCompare(b.religion),
    sortDirections: ["ascend", "descend"],
    ...selectFilterColumn<EmployeeModel>("agama", religions, (value) => {
      setTableParams({
        ...tableParams,
        filters: {
          ...tableParams.filters,
          religion: value,
        },
      });
    }),
  },
  {
    key: "signature",
    title: "Signature",
    dataIndex: "signature_file",
    render: (value, record) => {
      return (
        <EmployeeSignatureUpload
          value={value}
          id={record.id}
          messageApi={messageApi}
          fetchData={fetchData}
          notificationApi={notificationApi}
        />
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
            title={`Confirm delete ${record?.employee_id}?`}
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
