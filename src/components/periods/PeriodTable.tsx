import {
  Table,
  type FormInstance,
  type TablePaginationConfig,
  type UploadFile,
} from "antd";
import { useState } from "react";
import type { PeriodModel, PeriodTableParams } from "../../models/period";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { periodColumns } from "../../constants/periodColumns";
import type { TFunction } from "i18next";
import { periodDeleted } from "../../services/period";
import { processFinish, processStart } from "../../helpers/process";

interface Props {
  setTableParams: (params: PeriodTableParams) => void;
  fetchData: () => void;
  setId: (id: string) => void;
  tableParams: PeriodTableParams;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  t: TFunction;
  dataSource: PeriodModel[];
  loading: boolean;
  form: FormInstance;
}

const PeriodTable = ({
  tableParams,
  setTableParams,
  t,
  dataSource,
  loading,
  messageApi,
  fetchData,
  setId,
  notificationApi,
  form,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const [file, setFile] = useState<UploadFile[] | null>(null);

  const handleDelete = (id: string) => {
    periodDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: PeriodModel) => {
    processStart(messageApi, "editPeriod", "Editing Period");
    processFinish(messageApi, () => {
      setId(record.id);
      setTimeout(() => {
        form.setFieldsValue(record);
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

  const columns = periodColumns({
    handleDelete,
    handleEdit,
    processing,
    setTableParams,
    t,
    tableParams,
    file,
    setFile,
    messageApi,
    notificationApi,
    fetchData,
  });

  return (
    <Table
      bordered
      columns={columns}
      pagination={tableParams.pagination}
      size="middle"
      rowKey={"id"}
      dataSource={dataSource}
      loading={loading}
      onChange={handleChangeTable}
    />
  );
};

export default PeriodTable;
