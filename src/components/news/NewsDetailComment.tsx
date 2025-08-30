import { Button, Card, Flex, Input, Table, Typography } from "antd";
import type {
  CommentNews,
  CommentNewsTableParams,
} from "../../models/commentNews";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { TFunction } from "i18next";
import { commentNewsColumns } from "../../constants/newsColumns";
import { SearchOutlined } from "@ant-design/icons";
import { commentNewsDeleted } from "../../services/commentNews";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";

interface Props {
  tableParams: CommentNewsTableParams;
  t: TFunction;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  loading: boolean;
  dataSource: CommentNews[];
  setTableParams: Dispatch<SetStateAction<CommentNewsTableParams>>;
  fetchData: () => void;
}

const NewsDetailComment = (params: Props) => {
  const {
    setTableParams,
    t,
    tableParams,
    dataSource,
    loading,
    fetchData,
    messageApi,
    notificationApi,
  } = params;

  const [processing, setProcessing] = useState(false);

  const handleDelete = (id: string) => {
    commentNewsDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const columns = commentNewsColumns({
    handleDelete,
    processing,
    t,
    tableParams,
  });

  return (
    <Card>
      <Typography.Title level={3}>
        {t("news.detail.comment.list")}
      </Typography.Title>

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

export default NewsDetailComment;
