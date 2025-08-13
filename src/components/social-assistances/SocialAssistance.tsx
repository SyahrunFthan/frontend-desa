import { Card, Drawer } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { TFunction } from "i18next";
import { useEffect, useState } from "react";
import {
  socialAssistanceState,
  type SocialAssistance,
  type SocialAssistanceModel,
  type SocialAssistanceTableParams,
} from "../../models/socialAssistance";
import SocialAssistanceTable from "./SocialAssistanceTable";
import { getSocialAssistance } from "../../apis";
import type { ResidentModel } from "../../models/resident";
import type { AxiosError } from "axios";
import { processFail } from "../../helpers/process";
import SocialAssistanceCreate from "./SocialAssistanceCreate";
import type { Option } from "../../models/global";
import type { AssistanceCategoryModel } from "../../models/assistanceCategory";
import SocialAssistanceEdit from "./SocialAssistanceEdit";

interface Props {
  t: TFunction;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  activeTab: string;
}

const SocialAssistanceComponent = ({
  messageApi,
  notificationApi,
  t,
  activeTab,
}: Props) => {
  const [tableParams, setTableParams] = useState<SocialAssistanceTableParams>({
    pagination: {
      showTotal: (total, range) =>
        `${range[0]} - ${range[1]} of ${total} items`,
      pageSizeOptions: ["5", "10", "20", "50", "100"],
      showSizeChanger: true,
      total: 0,
      pageSize: 5,
      current: 1,
    },
    filters: {
      assistance_id: "",
      month_of_aid: "",
      receipt_at: "",
      resident_id: "",
      status_assistance: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [residents, setResidents] = useState<Option[]>([]);
  const [assistanceCategories, setAssistanceCategories] = useState<Option[]>(
    []
  );
  const [record, setRecord] = useState<SocialAssistanceModel>(
    socialAssistanceState
  );
  const [dataSource, setDataSource] = useState<SocialAssistance[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getSocialAssistance({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        filters: tableParams.filters,
      });

      const { total, socialAssistances, residents, assistanceCategories } =
        response.data;

      const optionResident = residents.map((item: ResidentModel) => {
        return {
          label: `${item.resident_id} - ${item.fullname}`,
          value: item.id,
        };
      });

      const optionAssistance = assistanceCategories.map(
        (item: AssistanceCategoryModel) => {
          return {
            label: item.amount
              ? `${item.year}-${item.name}/Rp ${item.amount.toLocaleString()}`
              : `${item.year}-${item.name}`,
            value: item.id,
          };
        }
      );

      setDataSource(socialAssistances);
      setResidents(optionResident);
      setAssistanceCategories(optionAssistance);
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total,
        },
      }));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      processFail(
        messageApi,
        "fetchDataSocialAssistance",
        axiosError.response?.data?.message || "Server Error"
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.filters,
    activeTab === "social_assistance",
  ]);

  return (
    <Card>
      <SocialAssistanceTable
        assistances={assistanceCategories}
        setOpenCreate={setOpenCreate}
        setTableParams={setTableParams}
        tableParams={tableParams}
        dataSource={dataSource}
        loading={loading}
        fetchData={fetchData}
        messageApi={messageApi}
        notificationApi={notificationApi}
        setOpenEdit={setOpenEdit}
        setRecord={setRecord}
        t={t}
      />

      <Drawer
        open={openCreate}
        closable={false}
        title={t("social_assistance.createOf")}
      >
        <SocialAssistanceCreate
          assistances={assistanceCategories}
          residents={residents}
          t={t}
          setOpenDrawer={setOpenCreate}
          fetchData={fetchData}
          messageApi={messageApi}
          notificationApi={notificationApi}
        />
      </Drawer>

      <Drawer
        open={openEdit}
        closable={false}
        title={t("social_assistance.edit")}
      >
        <SocialAssistanceEdit
          assistances={assistanceCategories}
          residents={residents}
          t={t}
          setOpenDrawer={setOpenEdit}
          fetchData={fetchData}
          messageApi={messageApi}
          notificationApi={notificationApi}
          record={record}
          setRecord={setRecord}
        />
      </Drawer>
    </Card>
  );
};

export default SocialAssistanceComponent;
