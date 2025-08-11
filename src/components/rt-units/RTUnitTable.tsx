import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Input,
  Table,
  type FormInstance,
  type TablePaginationConfig,
} from "antd";
import type {
  RTUnitExtends,
  RTUnitModel,
  RTUnitTableParams,
} from "../../models/rtUnit";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { TFunction } from "i18next";
import { processFinish, processStart } from "../../helpers/process";
import { rtUnitColumns } from "../../constants/rtUnitColumns";
import { rtUnitDeleted } from "../../services/rtUnit";

interface Props {
  tableParams: RTUnitTableParams;
  setTableParams: (params: RTUnitTableParams) => void;
  fetchData: () => void;
  dataSource: RTUnitExtends[];
  loading: boolean;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  setId: Dispatch<SetStateAction<string>>;
  t: TFunction;
  form: FormInstance;
}

const RTUnitTable = ({
  dataSource,
  loading,
  messageApi,
  notificationApi,
  setId,
  setTableParams,
  tableParams,
  fetchData,
  t,
  form,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const handleDelete = (id: string) => {
    rtUnitDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: RTUnitModel) => {
    processStart(messageApi, "editRtUnit", "Editing Rt Unit");
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

  const columns = rtUnitColumns({
    handleDelete,
    handleEdit,
    processing,
    t,
    tableParams,
  });

  return (
    <>
      <Flex gap={"small"} className="w-full lg:w-[40%]">
        <Input
          placeholder="Search"
          onChange={(e) =>
            setTableParams({
              ...tableParams,
              search: e.target.value,
            })
          }
          onPressEnter={() => fetchData()}
        />
        <Button htmlType="button" onClick={() => fetchData()}>
          <SearchOutlined />
        </Button>
      </Flex>

      <Table
        columns={columns}
        className="mt-5"
        size="middle"
        dataSource={dataSource}
        rowKey={"id"}
        loading={loading}
        pagination={tableParams.pagination}
        scroll={{ x: "max-content" }}
        bordered
        onChange={handleChangeTable}
      />
    </>
  );
};

export default RTUnitTable;
