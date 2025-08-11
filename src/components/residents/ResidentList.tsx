import {
  Card,
  Table,
  Typography,
  type FormInstance,
  type TablePaginationConfig,
  type UploadFile,
} from "antd";
import type { ResidentModel, ResidentTableParams } from "../../models/resident";
import { useState } from "react";
import { residentColumns } from "../../constants/residentColumns";
import { residentDeleted } from "../../services/resident";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { processFinish, processStart } from "../../helpers/process";
import dayjs from "dayjs";

interface Props {
  tableParams: ResidentTableParams;
  dataSource: ResidentModel[];
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  loading: boolean;
  formEdit: FormInstance;
  setFile: (file: UploadFile[]) => void;
  setId: (val: string) => void;
  setIsOpenDrawer: (val: boolean) => void;
  setTableParams: (tableParams: ResidentTableParams) => void;
  fetchResident: () => void;
}

const ResidentList = ({
  tableParams,
  setTableParams,
  dataSource,
  loading,
  messageApi,
  notificationApi,
  fetchResident,
  setId,
  formEdit,
  setFile,
  setIsOpenDrawer,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const handleDelete = (id: string) => {
    residentDeleted({
      fetchResident,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: ResidentModel) => {
    setProcessing(true);
    processStart(messageApi, "editResident", "Open Drawer");
    processFinish(messageApi, () => {
      setId(record.id);
      setIsOpenDrawer(true);
      const dateFormat = dayjs(record.date_of_birth, "YYYY-MM-DD");

      setFile([
        {
          uid: record.id,
          name: record.image,
          status: "done",
          url: record.path_image,
        },
      ]);
      setTimeout(() => {
        formEdit.setFieldsValue({
          ...record,
          date_of_birth: dateFormat,
        });
        setProcessing(false);
      }, 100);
    });
  };

  const handleChangeTable = (pagination: TablePaginationConfig) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };

  const columns = residentColumns({
    handleDelete,
    handleEdit,
    processing,
    setTableParams,
    tableParams,
  });

  return (
    <Card>
      <Typography.Title level={3}>List Resident</Typography.Title>

      <Table
        columns={columns}
        rowKey={"id"}
        dataSource={dataSource}
        bordered
        size="middle"
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleChangeTable}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};

export default ResidentList;
