import { SearchOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Table } from "antd";
import { useState, type Dispatch, type SetStateAction } from "react";
import { assistanceCategoryColumns } from "../../constants/assistanceCategoryColumns";
import type {
  AssistanceCategoryModel,
  AssistanceCategoryTableParams,
} from "../../models/assistanceCategory";
import type { TFunction } from "i18next";
import { assistanceCategoryDeleted } from "../../services/assistanceCategory";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { processFinish, processStart } from "../../helpers/process";

interface Props {
  tableParams: AssistanceCategoryTableParams;
  setTableParams: Dispatch<SetStateAction<AssistanceCategoryTableParams>>;
  t: TFunction;
  loading: boolean;
  dataSource: AssistanceCategoryModel[];
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  setRecord: Dispatch<SetStateAction<AssistanceCategoryModel>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

const AssistanceCategoryTable = ({
  dataSource,
  loading,
  setTableParams,
  t,
  tableParams,
  fetchData,
  messageApi,
  notificationApi,
  setOpenDrawer,
  setRecord,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const handleDelete = (id: string) => {
    assistanceCategoryDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: AssistanceCategoryModel) => {
    processStart(messageApi, "editCategory", "Open Drawer");
    processFinish(messageApi, () => {
      setRecord(record);
      setOpenDrawer(true);
    });
  };

  const columns = assistanceCategoryColumns({
    handleDelete,
    handleEdit,
    processing,
    t,
    tableParams,
  });
  return (
    <>
      <Flex gap={"small"} className="w-full lg:w-[30%]">
        <Input
          placeholder="Search"
          onChange={(e) =>
            setTableParams({ ...tableParams, search: e.target.value })
          }
          onPressEnter={() => fetchData()}
        />
        <Button htmlType="button" onClick={() => fetchData()}>
          <SearchOutlined />
        </Button>
      </Flex>

      <Table
        columns={columns}
        bordered
        dataSource={dataSource}
        pagination={tableParams.pagination}
        rowKey={"id"}
        loading={loading}
        size="middle"
        className="mt-5"
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

export default AssistanceCategoryTable;
