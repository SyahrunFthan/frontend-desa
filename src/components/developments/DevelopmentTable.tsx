import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import React, { useState, type Dispatch, type SetStateAction } from "react";
import type {
  DevelopmentModel,
  DevelopmentTableParams,
} from "../../models/development";
import { Card, Table, Typography } from "antd";
import type { TFunction } from "i18next";
import { developmentColumns } from "../../constants/developmentColumns";
import { developmentDeleted } from "../../services/development";
import { processFinish, processStart } from "../../helpers/process";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  tableParams: DevelopmentTableParams;
  t: TFunction;
  dataSource: DevelopmentModel[];
  loading: boolean;
  setTableParams: Dispatch<SetStateAction<DevelopmentTableParams>>;
  setRecord: Dispatch<SetStateAction<DevelopmentModel>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

const DevelopmentTable = ({
  dataSource,
  fetchData,
  loading,
  messageApi,
  notificationApi,
  setTableParams,
  t,
  tableParams,
  setRecord,
  setOpenDrawer,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const handleDelete = (id: string) => {
    developmentDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: DevelopmentModel) => {
    processStart(messageApi, "editDevelopment", "Open Drawer");
    processFinish(messageApi, () => {
      setRecord(record);
      setOpenDrawer(true);
    });
  };

  const columns = developmentColumns({
    handleDelete,
    handleEdit,
    processing,
    setTableParams,
    t,
    tableParams,
  });

  return (
    <Card>
      <Typography.Title level={3}>{t("development.list")}</Typography.Title>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={tableParams.pagination}
        rowKey={"id"}
        scroll={{ x: "max-content" }}
        size="middle"
        onChange={(pagination) => {
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              current: pagination.current,
              pageSize: pagination.pageSize,
            },
          });
        }}
        bordered
      />
    </Card>
  );
};

export default DevelopmentTable;
