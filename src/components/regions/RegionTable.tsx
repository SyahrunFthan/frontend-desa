import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Flex,
  Input,
  Table,
  Typography,
  type FormInstance,
  type TablePaginationConfig,
} from "antd";
import type { TFunction } from "i18next";
import type { RegionModel, RegionTableParams } from "../../models/region";
import { useState, type Dispatch, type SetStateAction } from "react";
import { regionColumns } from "../../constants/regionColumns";
import { regionDeleted } from "../../services/region";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { processFinish, processStart } from "../../helpers/process";

interface Props {
  t: TFunction;
  tableParams: RegionTableParams;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  dataSource: RegionModel[];
  loading: boolean;
  form: FormInstance;
  setId: Dispatch<SetStateAction<string>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  setTableParams: (params: RegionTableParams) => void;
  fetchData: () => void;
}

const RegionTable = ({
  t,
  tableParams,
  setTableParams,
  fetchData,
  messageApi,
  notificationApi,
  dataSource,
  loading,
  form,
  setId,
  setOpenDrawer,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const handleDelete = (id: string) => {
    regionDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: RegionModel) => {
    processStart(messageApi, "editRegion", "Open Drawer");
    processFinish(messageApi, () => {
      setId(record.id);
      setOpenDrawer(true);

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

  const columns = regionColumns({
    handleDelete,
    handleEdit,
    processing,
    t,
    tableParams,
  });

  return (
    <Card>
      <Typography.Title level={3}>{t("region.list")}</Typography.Title>

      <Flex gap={"small"} className="w-full lg:w-[20%]">
        <Input
          placeholder="Search"
          value={tableParams.search}
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
        className="mt-5"
        scroll={{ x: "max-content" }}
        rowKey={"id"}
        pagination={tableParams.pagination}
        onChange={handleChangeTable}
        loading={loading}
        dataSource={dataSource}
      />
    </Card>
  );
};

export default RegionTable;
