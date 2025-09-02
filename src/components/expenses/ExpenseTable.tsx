import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { ExpenseModel, ExpenseTableParams } from "../../models/expense";
import {
  Card,
  Table,
  Typography,
  type FormInstance,
  type TablePaginationConfig,
} from "antd";
import type { TFunction } from "i18next";
import { useState, type Dispatch, type SetStateAction } from "react";
import { expenseColumns } from "../../constants/expenseColumns";
import type { Option } from "../../models/global";
import { expenseDeleted } from "../../services/expense";
import { processFinish, processStart } from "../../helpers/process";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  tableParams: ExpenseTableParams;
  loading: boolean;
  t: TFunction;
  dataSource: ExpenseModel[];
  incomes: Option[];
  periods: Option[];
  form: FormInstance;
  setId: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setTableParams: (params: ExpenseTableParams) => void;
  fetchData: () => void;
}

const ExpenseTable = ({
  loading,
  messageApi,
  notificationApi,
  setTableParams,
  t,
  tableParams,
  dataSource,
  incomes,
  periods,
  fetchData,
  form,
  setId,
  setOpen,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const handleDelete = (id: string) => {
    expenseDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: ExpenseModel) => {
    processStart(messageApi, "editExpense", "Open Drawer");
    processFinish(messageApi, () => {
      setId(record.id);
      setOpen(true);
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

  const columns = expenseColumns({
    handleDelete,
    handleEdit,
    incomes,
    periods,
    processing,
    setTableParams,
    t,
    tableParams,
  });

  return (
    <Card>
      <Typography.Title level={3}>{t("expense.list")}</Typography.Title>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={tableParams.pagination}
        rowKey={"id"}
        scroll={{ x: "max-content" }}
        size="middle"
        loading={loading}
        onChange={handleChangeTable}
        bordered
      />
    </Card>
  );
};

export default ExpenseTable;
