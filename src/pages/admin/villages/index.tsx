import { useTranslation } from "react-i18next";
import AdminLayout from "../../../layouts/adminLayout";
import { Card, message, notification } from "antd";
import {
  VillageFormAbout,
  VillageFormVision,
  VillageLogo,
  VillagePhoto,
} from "../../../components";
import { getVillage } from "../../../apis";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";
import { useEffect, useState } from "react";
import type { VillageModel } from "../../../models/village";

const Village = () => {
  const [data, setData] = useState<VillageModel | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const { t } = useTranslation();

  const fetchData = async () => {
    try {
      const response = await getVillage();
      if (response.status === 200) {
        setData(response.data.result);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      processFail(
        messageApi,
        "fetchData",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AdminLayout>
      {contextHolder}
      {contextHolderN}

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex flex-col w-full lg:w-[40%] gap-5">
          <Card title={t("village.title_logo")}>
            <VillageLogo
              t={t}
              messageApi={messageApi}
              data={data}
              notificationApi={notificationApi}
            />
          </Card>
          <Card title={t("village.title_image")}>
            <VillagePhoto
              t={t}
              messageApi={messageApi}
              data={data}
              notificationApi={notificationApi}
            />
          </Card>
        </div>
        <div className="flex flex-col w-full gap-5">
          <Card title={t("village.title_other")}>
            <VillageFormVision
              t={t}
              data={data}
              messageApi={messageApi}
              notificationApi={notificationApi}
            />
          </Card>
          <Card title={t("village.title_about")}>
            <VillageFormAbout
              messageApi={messageApi}
              notificationApi={notificationApi}
              t={t}
              data={data}
            />
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Village;
