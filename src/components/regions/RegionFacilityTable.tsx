import type { TFunction } from "i18next";
import {
  facilityState,
  type FacilityModel,
  type FacilityTableParams,
} from "../../models/facility";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { facilityDeleted } from "../../services/facility";
import { processFinish, processStart } from "../../helpers/process";
import { facilityColumns } from "../../constants/facilityColumns";
import { Button, Drawer, Flex, Input, Table, Typography } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import FacilityCreate from "../facilities/FacilityCreate";
import FacilityEdit from "../facilities/FacilityEdit";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  tableParams: FacilityTableParams;
  t: TFunction;
  setTableParams: Dispatch<SetStateAction<FacilityTableParams>>;
  dataSource: FacilityModel[];
  loading: boolean;
  region_id: string;
  fetchData: () => void;
}

const RegionFacilityTable = ({
  fetchData,
  messageApi,
  notificationApi,
  setTableParams,
  t,
  tableParams,
  dataSource,
  loading,
  region_id,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const [record, setRecord] = useState<FacilityModel>(facilityState);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

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

      <Drawer
        open={openCreate}
        title={t("facility.createOf")}
        closable={false}
        width={520}
      >
        <FacilityCreate
          t={t}
          setOpenDrawer={setOpenCreate}
          fetchData={fetchData}
          messageApi={messageApi}
          notificationApi={notificationApi}
          region_id={region_id}
        />
      </Drawer>

      {openEdit && (
        <Drawer
          open={openEdit}
          closable={false}
          title={t("facility.edit")}
          width={520}
          key={record.id}
        >
          <FacilityEdit
            fetchData={fetchData}
            messageApi={messageApi}
            notificationApi={notificationApi}
            record={record}
            setOpenDrawer={setOpenEdit}
            setRecord={setRecord}
            t={t}
            region_id={region_id}
          />
        </Drawer>
      )}
    </>
  );
};

export default RegionFacilityTable;
