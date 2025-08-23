import { Button, Flex, Input, Table, Typography } from "antd";
import type { TFunction } from "i18next";
import type { ActivityModel, ActivityTableParams } from "../../models/activity";
import { useState, type Dispatch, type SetStateAction } from "react";
import { activityColumns } from "../../constants/activityColumns";
import { SearchOutlined } from "@ant-design/icons";
import { activityDeleted } from "../../services/activity";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { processFinish, processStart } from "../../helpers/process";

interface Props {
  t: TFunction;
  tableParams: ActivityTableParams;
  setTableParams: Dispatch<SetStateAction<ActivityTableParams>>;
  loading: boolean;
  dataSource: ActivityModel[];
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  setRecord: Dispatch<SetStateAction<ActivityModel>>;
  fetchData: () => void;
}

const ActivityTable = ({
  setTableParams,
  t,
  tableParams,
  loading,
  dataSource,
  fetchData,
  messageApi,
  notificationApi,
  setOpenDrawer,
  setRecord,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const handleDelete = (id: string) => {
    activityDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: ActivityModel) => {
    processStart(messageApi, "editActivity", "Open Drawer");
    processFinish(messageApi, () => {
      setOpenDrawer(true);
      setRecord(record);
    });
  };

  const columns = activityColumns({
    handleDelete,
    handleEdit,
    processing,
    t,
    tableParams,
  });

  return (
    <>
      <Typography.Title level={3}>{t("activity.list")}</Typography.Title>

      <Flex gap={"small"} className="w-full lg:w-[30%]">
        <Input
          placeholder="Search"
          value={tableParams.search}
          onChange={(e) =>
            setTableParams({ ...tableParams, search: e.target.value })
          }
          onPressEnter={() => fetchData()}
        />
        <Button onClick={() => fetchData()}>
          <SearchOutlined />
        </Button>
      </Flex>

      <Table
        columns={columns}
        pagination={tableParams.pagination}
        loading={loading}
        bordered
        rowKey={"id"}
        className="mt-5"
        scroll={{ x: "max-content" }}
        size="middle"
        dataSource={dataSource}
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

export default ActivityTable;
