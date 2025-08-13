import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Table, Typography } from "antd";
import type { TFunction } from "i18next";
import type {
  SocialAssistance,
  SocialAssistanceModel,
  SocialAssistanceTableParams,
} from "../../models/socialAssistance";
import { useState, type Dispatch, type SetStateAction } from "react";
import { socialAssistanceColumns } from "../../constants/socialAssistanceColumns";
import { socialAssistanceDeleted } from "../../services/socialAssistance";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { processFinish, processStart } from "../../helpers/process";
import type { Option } from "../../models/global";

interface Props {
  t: TFunction;
  tableParams: SocialAssistanceTableParams;
  setTableParams: Dispatch<SetStateAction<SocialAssistanceTableParams>>;
  setOpenCreate: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  dataSource: SocialAssistance[];
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  setRecord: Dispatch<SetStateAction<SocialAssistanceModel>>;
  setOpenEdit: Dispatch<SetStateAction<boolean>>;
  assistances: Option[];
  fetchData: () => void;
}

const SocialAssistanceTable = ({
  t,
  setOpenCreate,
  setTableParams,
  tableParams,
  dataSource,
  loading,
  fetchData,
  messageApi,
  notificationApi,
  setRecord,
  setOpenEdit,
  assistances,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const handleDelete = (id: string) => {
    socialAssistanceDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: SocialAssistanceModel) => {
    processStart(messageApi, "openDrawer", "Open Drawer");
    processFinish(messageApi, () => {
      setRecord(record);
      setOpenEdit(true);
    });
  };

  const columns = socialAssistanceColumns({
    handleDelete,
    handleEdit,
    processing,
    setTableParams,
    t,
    tableParams,
    assistances,
  });
  return (
    <>
      <Flex justify="space-between">
        <Typography.Title level={3}>
          {t("social_assistance.list")}
        </Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpenCreate(true)}
        >
          {t("social_assistance.create")}
        </Button>
      </Flex>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={tableParams.pagination}
        bordered
        rowKey={"id"}
        size="middle"
        loading={loading}
        scroll={{ x: "max-content" }}
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
    </>
  );
};

export default SocialAssistanceTable;
