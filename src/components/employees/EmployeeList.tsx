import { Card, Table, Typography, type TablePaginationConfig } from "antd";
import type { EmployeeModel, EmployeeTableParams } from "../../models/employee";
import { useState, type Dispatch, type SetStateAction } from "react";
import { employeeColumns } from "../../constants/employeeColumns";
import { processFinish, processStart } from "../../helpers/process";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { positions } from "../../models/global";
import { employeeDeleted } from "../../services/employee";

interface Props {
  tableParams: EmployeeTableParams;
  loading: boolean;
  dataSource: EmployeeModel[];
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  setTableParams: Dispatch<SetStateAction<EmployeeTableParams>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  setRecord: Dispatch<SetStateAction<EmployeeModel>>;
  fetchData: () => void;
}

const EmployeeList = ({
  tableParams,
  loading,
  setTableParams,
  dataSource,
  messageApi,
  notificationApi,
  setOpenDrawer,
  fetchData,
  setRecord,
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
    processStart(messageApi, "editProcess", "Editing Employee");
    processFinish(messageApi, () => {
      const selectedPosition = positions.find(
        (pos) => pos.value === record.level
      );

      setRecord({
        ...record,
        position: selectedPosition?.label ?? record.position,
      });
      setOpenDrawer(true);
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
