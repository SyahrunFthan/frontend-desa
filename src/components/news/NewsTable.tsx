import { Button, Card, Flex, Input, Table, Typography } from "antd";
import type { NewsModel, NewsTableParams } from "../../models/news";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { TFunction } from "i18next";
import { SearchOutlined } from "@ant-design/icons";
import { newsColumns } from "../../constants/newsColumns";
import { newsDeleted } from "../../services/news";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { processFinish, processStart } from "../../helpers/process";

interface Props {
  tableParams: NewsTableParams;
  t: TFunction;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  loading: boolean;
  dataSource: NewsModel[];
  setTableParams: Dispatch<SetStateAction<NewsTableParams>>;
  setRecord: Dispatch<SetStateAction<NewsModel | null>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

const NewsTable = (params: Props) => {
  const {
    dataSource,
    fetchData,
    loading,
    setTableParams,
    t,
    tableParams,
    messageApi,
    notificationApi,
    setOpenDrawer,
    setRecord,
  } = params;

  const [processing, setProcessing] = useState(false);

  const handleDelete = (id: string) => {
    newsDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: NewsModel) => {
    processStart(messageApi, "newsEdit", "Open Form Edit");
    processFinish(messageApi, () => {
      setRecord(record);
      setOpenDrawer(true);
    });
  };

  const columns = newsColumns({
    handleDelete,
    handleEdit,
    processing,
    t,
    tableParams,
  });

  return (
    <Card>
      <Typography.Title level={3}>{t("news.list")}</Typography.Title>

      <Flex gap={"small"} className="w-full lg:w-[20%]">
        <Input
          placeholder="Seach"
          onChange={(e) =>
            setTableParams({ ...tableParams, search: e.target.value })
          }
          value={tableParams.search}
          onPressEnter={() => fetchData()}
        />
        <Button onClick={() => fetchData()} loading={loading}>
          <SearchOutlined />
        </Button>
      </Flex>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={tableParams.pagination}
        loading={loading}
        bordered
        rowKey={"id"}
        size="middle"
        tableLayout="auto"
        scroll={{ x: "max-content" }}
        className="mt-5"
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

export default NewsTable;
