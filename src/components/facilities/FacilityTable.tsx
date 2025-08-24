import { useState, type Dispatch, type SetStateAction } from "react";
import type { FacilityModel, FacilityTableParams } from "../../models/facility";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { TFunction } from "i18next";
import { facilityColumns } from "../../constants/facilityColumns";
import { Button, Flex, Input, Table, Typography } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { facilityDeleted } from "../../services/facility";
import { processFinish, processStart } from "../../helpers/process";

interface Props {
  tableParams: FacilityTableParams;
  setTableParams: Dispatch<SetStateAction<FacilityTableParams>>;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  dataSource: FacilityModel[];
  loading: boolean;
  t: TFunction;
  setOpenCreate: Dispatch<SetStateAction<boolean>>;
  setOpenEdit: Dispatch<SetStateAction<boolean>>;
  setRecord: Dispatch<SetStateAction<FacilityModel>>;
  fetchData: () => void;
}

const FacilityTable = ({
  dataSource,
  loading,
  messageApi,
  notificationApi,
  setTableParams,
  setOpenCreate,
  setOpenEdit,
  setRecord,
  tableParams,
  t,
  fetchData,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const handleDelete = async (id: string) => {
    facilityDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: FacilityModel) => {
    processStart(messageApi, "editFacility", "Open Form Drawer");
    processFinish(messageApi, () => {
      setRecord(record);
      setOpenEdit(true);
    });
  };

  const columns = facilityColumns({
    handleDelete,
    handleEdit,
    processing,
    t,
    tableParams,
  });

  return (
    <>
      <Typography.Title level={3}>{t("facility.list")}</Typography.Title>

      <Flex gap={"small"} justify="space-between">
        <Flex gap={"small"} className="w-full lg:w-[20%]">
          <Input
            placeholder="Search"
            value={tableParams.search}
            onChange={(e) =>
              setTableParams({
                ...tableParams,
                search: e.target.value,
              })
            }
            onPressEnter={() => fetchData()}
          />
          <Button onClick={() => fetchData()}>
            <SearchOutlined />
          </Button>
        </Flex>
        <Button
          type="default"
          icon={<PlusOutlined />}
          className="bg-blue-500 text-white border-none hover:!bg-blue-600 hover:!text-white"
          onClick={() => setOpenCreate(true)}
        >
          {t("facility.create")}
        </Button>
      </Flex>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={tableParams.pagination}
        bordered
        rowKey={"id"}
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
    </>
  );
};

export default FacilityTable;
