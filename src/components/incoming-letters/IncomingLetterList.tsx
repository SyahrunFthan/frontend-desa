import {
  Card,
  Table,
  Typography,
  type FormInstance,
  type TablePaginationConfig,
  type UploadFile,
} from "antd";
import { useTranslation } from "react-i18next";
import { incomingLetterColumns } from "../../constants/incomingLetterColumns";
import { useState } from "react";
import type {
  IncomingLetterModel,
  IncomingLetterTableParams,
} from "../../models/incomingLetter";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { processFinish, processStart } from "../../helpers/process";
import dayjs from "dayjs";
import { incomingLetterDeleted } from "../../services/incomingLetter";

interface Props {
  tableParams: IncomingLetterTableParams;
  loading: boolean;
  dataSource: IncomingLetterModel[];
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  formEdit: FormInstance;
  setTableParams: (params: IncomingLetterTableParams) => void;
  setId: (id: string) => void;
  setOpenDrawer: (open: boolean) => void;
  setFile: (file: UploadFile[] | null) => void;
  fetchData: () => void;
}

const IncomingLetterList = ({
  setTableParams,
  tableParams,
  loading,
  dataSource,
  setId,
  formEdit,
  setOpenDrawer,
  messageApi,
  setFile,
  notificationApi,
  fetchData,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const { t } = useTranslation();

  const handleEdit = (record: IncomingLetterModel) => {
    processStart(messageApi, "openDrawer", "Open Drawer");
    processFinish(messageApi, () => {
      setOpenDrawer(true);
      setId(record.id);
      setFile([
        {
          uid: record.id,
          name: record.letter_file,
          status: "done",
          url: record.letter_path,
        },
      ]);
      const date_of_letter = dayjs(record.date_of_letter, "YYYY-MM-DD");
      const date_of_receipt = dayjs(record.date_of_receipt, "YYYY-MM-DD");

      setTimeout(() => {
        formEdit.setFieldsValue({
          ...record,
          date_of_letter,
          date_of_receipt,
        });
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

  const handleDelete = (id: string) => {
    incomingLetterDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const columns = incomingLetterColumns({
    handleDelete,
    handleEdit,
    processing,
    setTableParams,
    tableParams,
  });

  return (
    <Card>
      <Typography.Title level={3}>{t("incoming letter list")}</Typography.Title>

      <Table
        columns={columns}
        bordered
        size="middle"
        loading={loading}
        dataSource={dataSource}
        rowKey={"id"}
        scroll={{ x: "max-content" }}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default IncomingLetterList;
