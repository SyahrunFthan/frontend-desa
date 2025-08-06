import { DashboardOutlined } from "@ant-design/icons";
import AdminLayout from "../../../layouts/adminLayout";
import {
  Form,
  message,
  notification,
  Tabs,
  type TabsProps,
  type UploadFile,
} from "antd";
import { useEffect, useState } from "react";
import {
  ResidentCreate,
  ResidentEdit,
  ResidentList,
  ResidentStatistic,
} from "../../../components";
import type {
  ProfesionStatistic,
  ReligionStatistic,
  ResidentModel,
  ResidentTableParams,
} from "../../../models/resident";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";
import { getResident } from "../../../apis";
import type { Option } from "../../../models/global";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Resident = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [id, setId] = useState("");
  const [profesions, setProfesions] = useState<ProfesionStatistic[]>([]);
  const [religions, setReligions] = useState<ReligionStatistic[]>([]);
  const [dataSource, setDataSource] = useState<ResidentModel[]>([]);
  const [familyOptions, setFamilyOptions] = useState<Option[]>([]);
  const [file, setFile] = useState<UploadFile[] | null>(null);
  const { t } = useTranslation();

  const [tableParams, setTableParams] = useState<ResidentTableParams>({
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
      date_of_birth: "",
      family_card_id: "",
      place_of_birth: "",
      resident_id: "",
      profesion: "",
      fullname: "",
    },
  });
  const [formEdit] = Form.useForm();

  const fetchResident = async () => {
    try {
      setLoading(true);
      const response = await getResident({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        filters: tableParams.filters,
      });

      const familyOption = response.data.familyCards.map((item: any) => {
        return {
          label: item.family_id,
          value: item.id,
        };
      });

      setProfesions(response.data.profesions);
      setReligions(response.data.religionData);
      setFamilyOptions(familyOption);
      setDataSource(response.data?.response);
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: response.data?.total,
        },
      }));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.log(axiosError.response);
      processFail(
        messageApi,
        "fetchResident",
        axiosError.response?.data?.message || "Server Error"
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  useEffect(() => {
    fetchResident();
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.filters,
  ]);

  const tabItems: TabsProps["items"] = [
    {
      key: "list",
      label: t("residents.list"),
      children: (
        <ResidentList
          tableParams={tableParams}
          setTableParams={setTableParams}
          dataSource={dataSource}
          loading={loading}
          messageApi={messageApi}
          notificationApi={notificationApi}
          fetchResident={fetchResident}
          formEdit={formEdit}
          setId={setId}
          setIsOpenDrawer={setIsOpenDrawer}
          setFile={setFile}
        />
      ),
    },
    {
      key: "create",
      label: t("residents.create"),
      children: (
        <ResidentCreate
          messageApi={messageApi}
          notificationApi={notificationApi}
          fetchResident={fetchResident}
          familyCardOptions={familyOptions}
        />
      ),
    },
    {
      key: "statistic",
      label: t("residents.statistic"),
      children: (
        <ResidentStatistic profesions={profesions} religions={religions} />
      ),
    },
  ];

  return (
    <AdminLayout
      pageName={t("resident")}
      breadCrumbs={[
        {
          title: (
            <Link to={"/admin/dashboard"}>
              <DashboardOutlined />
              <span className="ml-1">{t("dashboard")}</span>
            </Link>
          ),
        },
        {
          title: (
            <div className="flex items-center gap-1">
              <span>{t("resident")}</span>
            </div>
          ),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}
      <Tabs items={tabItems} />

      {isOpenDrawer && (
        <ResidentEdit
          familyCardOptions={familyOptions}
          form={formEdit}
          isOpenDrawer={isOpenDrawer}
          setIsOpenDrawer={setIsOpenDrawer}
          id={id}
          file={file}
          setFile={setFile}
          setId={setId}
          fetchResident={fetchResident}
          messageApi={messageApi}
          notificationApi={notificationApi}
        />
      )}
    </AdminLayout>
  );
};

export default Resident;
