import { SearchOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Table, type TablePaginationConfig } from "antd";
import type { RWUnitModel, RWUnitTableParams } from "../../models/rwUnit";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { rwUnitDeleted } from "../../services/rwUnit";
import { useState, type Dispatch, type SetStateAction } from "react";
import { processFinish, processStart } from "../../helpers/process";
import type { FormInstance } from "antd/lib";
import { rwUnitColumns } from "../../constants/rwUnitColumns";
import type { TFunction } from "i18next";

interface Props {
  tableParams: RWUnitTableParams;
  setTableParams: (params: RWUnitTableParams) => void;
  fetchData: () => void;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  setId: Dispatch<SetStateAction<string>>;
  t: TFunction;
  dataSource: RWUnitModel[];
  loading: boolean;
}

const RWUnitTable = ({
  fetchData,
  messageApi,
  notificationApi,
  setTableParams,
  tableParams,
  form,
  setId,
  t,
  dataSource,
  loading,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const handleDelete = (id: string) => {
    rwUnitDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: RWUnitModel) => {
    processStart(messageApi, "editRwUnit", "Editing Rw Unit");
    processFinish(messageApi, () => {
      setId(record.id);
      setTimeout(() => {
        form.setFieldsValue(record);
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

  const columns = rwUnitColumns({
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
        className="mt-5"
        columns={columns}
        pagination={tableParams.pagination}
        bordered
        dataSource={dataSource}
        rowKey={"id"}
        loading={loading}
        onChange={handleTableChange}
        size="middle"
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default RWUnitTable;
