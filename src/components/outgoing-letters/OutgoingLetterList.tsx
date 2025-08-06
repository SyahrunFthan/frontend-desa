import {
  Card,
  Table,
  Typography,
  type FormInstance,
  type TablePaginationConfig,
  type UploadFile,
} from "antd";
import { useTranslation } from "react-i18next";
import { outgoingLetterColumns } from "../../constants/outgoingLetterColumns";
import { useState } from "react";
import type {
  OutgoingLetterModel,
  OutgoingLetterTableParams,
} from "../../models/outgoingLetter";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { outgoingLetterDeleted } from "../../services/outgoingLetter";
import { processFinish, processStart } from "../../helpers/process";
import dayjs from "dayjs";

interface Props {
  tableParams: OutgoingLetterTableParams;
  setTableParams: (params: OutgoingLetterTableParams) => void;
  dataSource: OutgoingLetterModel[];
  loading: boolean;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  fetchData: () => void;
  setOpenDrawer: (open: boolean) => void;
  setId: (id: string) => void;
  formEdit: FormInstance;
  setFile: (file: UploadFile[] | null) => void;
}

const OutgoingLetterList = ({
  setTableParams,
  tableParams,
  dataSource,
  loading,
  messageApi,
  notificationApi,
  fetchData,
  formEdit,
  setId,
  setOpenDrawer,
  setFile,
}: Props) => {
  const { t } = useTranslation();
  const [processing, setProcessing] = useState(false);

  const handleDelete = (id: string) => {
    outgoingLetterDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: OutgoingLetterModel) => {
    processStart(messageApi, "editOutgoingLetter", "Open Drawer");
    processFinish(messageApi, () => {
      setId(record.id);
      setOpenDrawer(true);
      const formatDate = dayjs(record.date_of_letter, "YYYY-MM-DD");

      setFile([
        {
          uid: record.id,
          name: record.letter_file,
          url: record.letter_path,
        },
      ]);

      setTimeout(() => {
        formEdit.setFieldsValue({
          ...record,
          date_of_letter: formatDate,
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

  const columns = outgoingLetterColumns({
    handleDelete,
    handleEdit,
    processing,
    setTableParams,
    t,
    tableParams,
  });
  return (
    <Card>
      <Typography.Title level={3}>{t("outgoingLetters.list")}</Typography.Title>

      <Table
        columns={columns}
        bordered
        size="middle"
        rowKey={"id"}
        pagination={tableParams.pagination}
        dataSource={dataSource}
        loading={loading}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default OutgoingLetterList;
