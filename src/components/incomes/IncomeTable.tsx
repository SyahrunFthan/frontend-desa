import {
  Card,
  Table,
  Typography,
  type FormInstance,
  type TablePaginationConfig,
} from "antd";
import type { TFunction } from "i18next";
import type { IncomeModel, IncomeTableParams } from "../../models/income";
import type { Option } from "../../models/global";
import { useState, type Dispatch, type SetStateAction } from "react";
import { incomeColumns } from "../../constants/incomeColumns";
import { incomeDeleted } from "../../services/income";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { processFinish, processStart } from "../../helpers/process";

interface Props {
  setTableParams: (params: IncomeTableParams) => void;
  t: TFunction;
  tableParams: IncomeTableParams;
  dataSource: IncomeModel[];
  periods: Option[];
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  loading: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  formEdit: FormInstance;
  setId: Dispatch<SetStateAction<string>>;
  fetchData: () => void;
}

const IncomeTable = ({
  dataSource,
  periods,
  setTableParams,
  t,
  tableParams,
  fetchData,
  messageApi,
  notificationApi,
  loading,
  setIsOpen,
  setId,
  formEdit,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const handleDelete = (id: string) => {
    incomeDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: Omit<IncomeModel, "period">) => {
    processStart(messageApi, "editIncome", "Open Drawer");
    processFinish(messageApi, () => {
      setIsOpen(true);
      setId(record.id);

      setTimeout(() => {
        formEdit.setFieldsValue(record);
      }, 100);
    });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: pagination?.current,
        pageSize: pagination?.pageSize,
      },
    });
  };

  const columns = incomeColumns({
    handleDelete,
    handleEdit,
    t,
    periods,
    processing,
    setTableParams,
    tableParams,
  });

  return (
    <Card>
      <Typography.Title level={3}>{t("incomes.list")}</Typography.Title>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={"id"}
        bordered
        size="middle"
        scroll={{ x: "max-content" }}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
        loading={loading}
      />
    </Card>
  );
};

export default IncomeTable;
