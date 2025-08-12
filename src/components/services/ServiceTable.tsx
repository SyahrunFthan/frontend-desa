import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { ServiceModel, ServiceTableParams } from "../../models/service";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { TFunction } from "i18next";
import { Card, Table, Typography } from "antd";
import { serviceColumns } from "../../constants/serviceColumns";
import { serviceDeleted } from "../../services/service";
import { processFinish, processStart } from "../../helpers/process";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  tableParams: ServiceTableParams;
  setTableParams: Dispatch<SetStateAction<ServiceTableParams>>;
  setRecord: Dispatch<SetStateAction<ServiceModel>>;
  setId: Dispatch<SetStateAction<string>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  t: TFunction;
  loading: boolean;
  dataSource: ServiceModel[];
  fetchData: () => void;
}

const ServiceTable = ({
  messageApi,
  notificationApi,
  setRecord,
  setId,
  setOpenDrawer,
  setTableParams,
  tableParams,
  dataSource,
  loading,
  t,
  fetchData,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const handleDelete = (id: string) => {
    serviceDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: ServiceModel) => {
    processStart(messageApi, "editService", "Open Drawer");
    processFinish(messageApi, () => {
      setId(record.id);
      setRecord(record);
      setOpenDrawer(true);
    });
  };

  const columns = serviceColumns({
    handleDelete,
    handleEdit,
    processing,
    setTableParams,
    t,
    tableParams,
  });

  return (
    <Card>
      <Typography.Title level={3}>{t("service.list")}</Typography.Title>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={tableParams.pagination}
        size="middle"
        rowKey={"id"}
        scroll={{ x: "max-content" }}
        bordered
        loading={loading}
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
      />
    </Card>
  );
};

export default ServiceTable;
