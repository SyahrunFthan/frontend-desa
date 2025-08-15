import { Card, Table, Typography } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { Taxes, TaxModel, TaxTableParams } from "../../models/tax";
import type { TFunction } from "i18next";
import { taxColumns } from "../../constants/taxColumns";
import { taxDeleted } from "../../services/tax";
import { processFinish, processStart } from "../../helpers/process";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  loading: boolean;
  dataSource: Taxes[];
  t: TFunction;
  tableParams: TaxTableParams;
  setTableParams: Dispatch<SetStateAction<TaxTableParams>>;
  setRecord: Dispatch<SetStateAction<TaxModel>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

const TaxTable = ({
  dataSource,
  loading,
  messageApi,
  notificationApi,
  t,
  setTableParams,
  tableParams,
  fetchData,
  setOpenDrawer,
  setRecord,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const handleDelete = (id: string) => {
    taxDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: TaxModel) => {
    processStart(messageApi, "editTax", "Open Drawer");
    processFinish(messageApi, () => {
      setOpenDrawer(true);
      setRecord(record);
    });
  };

  const columns = taxColumns({
    handleDelete,
    handleEdit,
    processing,
    setTableParams,
    t,
    tableParams,
  });

  return (
    <Card>
      <Typography.Title level={3}>{t("tax.list")}</Typography.Title>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={tableParams.pagination}
        rowKey={"id"}
        scroll={{ x: "max-content" }}
        size="middle"
        bordered
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

export default TaxTable;
