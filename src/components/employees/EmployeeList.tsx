import {
  Card,
  Table,
  Typography,
  type FormInstance,
  type TablePaginationConfig,
  type UploadFile,
} from "antd";
import type { EmployeeModel, EmployeeTableParams } from "../../models/employee";
import { useState } from "react";
import { employeeColumns } from "../../constants/employeeColumns";
import { processFinish, processStart } from "../../helpers/process";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import dayjs from "dayjs";
import { positions } from "../../models/global";
import { employeeDeleted } from "../../services/employee";

interface Props {
  tableParams: EmployeeTableParams;
  loading: boolean;
  dataSource: EmployeeModel[];
  formEdit: FormInstance;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  setId: (val: string) => void;
  setTableParams: (tableParams: EmployeeTableParams) => void;
  setOpenDrawer: (open: boolean) => void;
  setFile: (file: UploadFile[] | null) => void;
  setSignature: (signature: UploadFile[] | null) => void;
  fetchData: () => void;
}

const EmployeeList = ({
  tableParams,
  loading,
  setTableParams,
  dataSource,
  formEdit,
  messageApi,
  notificationApi,
  setOpenDrawer,
  setId,
  setFile,
  setSignature,
  fetchData,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const handleDelete = (id: string) => {
    employeeDeleted({
      id,
      fetchData,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: EmployeeModel) => {
    setProcessing(true);
    processStart(messageApi, "editProcess", "Editing Employee");
    processFinish(messageApi, () => {
      setOpenDrawer(true);
      setId(record.id);
      const dateFormat = dayjs(record.date_of_birth, "YYYY-MM-DD");
      setFile([
        {
          uid: record.id,
          name: record.image,
          status: "done",
          url: record.path_image,
        },
      ]);

      if (record.signature_file !== null) {
        setSignature([
          {
            uid: record.id,
            name: record.signature_file,
            status: "done",
            url: record.signature_path,
          },
        ]);
      }

      const selectedPosition = positions.find(
        (pos) => pos.value === record.level
      );

      setTimeout(() => {
        formEdit.setFieldsValue({
          ...record,
          date_of_birth: dateFormat,
          position_official: selectedPosition ?? null,
        });
        setProcessing(false);
      }, 100);
    });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };

  const columns = employeeColumns({
    handleDelete,
    handleEdit,
    processing,
    setTableParams,
    tableParams,
  });

  return (
    <Card>
      <Typography.Title level={3}>List Employee</Typography.Title>

      <Table
        size="middle"
        bordered
        columns={columns}
        dataSource={dataSource}
        pagination={tableParams.pagination}
        rowKey={"id"}
        loading={loading}
        scroll={{ x: "max-content" }}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default EmployeeList;
