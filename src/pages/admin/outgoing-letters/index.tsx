import { Link } from "react-router-dom";
import AdminLayout from "../../../layouts/adminLayout";
import { useTranslation } from "react-i18next";
import { DashboardOutlined } from "@ant-design/icons";
import {
  Form,
  message,
  notification,
  Tabs,
  type TabsProps,
  type UploadFile,
} from "antd";
import { useEffect, useState } from "react";
import type {
  OutgoingLetterModel,
  OutgoingLetterTableParams,
} from "../../../models/outgoingLetter";
import {
  OutgoingLetterCreate,
  OutgoingLetterEdit,
  OutgoingLetterList,
} from "../../../components";
import { getOutgoingLetter } from "../../../apis";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";

const OutgoingLetter = () => {
  const [tableParams, setTableParams] = useState<OutgoingLetterTableParams>({
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
      code: "",
      date_of_letter: "",
      objective: "",
      regarding: "",
      status_letter: "",
    },
  });
  const [dataSource, setDataSource] = useState<OutgoingLetterModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [id, setId] = useState("");
  const [file, setFile] = useState<UploadFile[] | null>(null);
  const [formEdit] = Form.useForm();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const { t } = useTranslation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getOutgoingLetter({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        filters: tableParams.filters,
      });

      setDataSource(response.data.rows);
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: response.data.total,
        },
      }));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      processFail(
        messageApi,
        "fetchData",
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
  ]);

  const items: TabsProps["items"] = [
    {
      key: "list",
      label: t("outgoingLetters.list"),
      children: (
        <OutgoingLetterList
          dataSource={dataSource}
          loading={loading}
          setTableParams={setTableParams}
          tableParams={tableParams}
          fetchData={fetchData}
          messageApi={messageApi}
          notificationApi={notificationApi}
          formEdit={formEdit}
          setFile={setFile}
          setId={setId}
          setOpenDrawer={setOpenDrawer}
        />
      ),
    },
    {
      key: "create",
      label: t("outgoingLetters.create"),
      children: (
        <OutgoingLetterCreate
          fetchData={fetchData}
          messageApi={messageApi}
          notificationApi={notificationApi}
        />
      ),
    },
  ];

  return (
    <AdminLayout
      pageName={t("outgoing letter")}
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
          title: t("outgoing letter"),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}
      <Tabs items={items} size="middle" type="card" />

      {openDrawer && (
        <OutgoingLetterEdit
          fetchData={fetchData}
          file={file}
          form={formEdit}
          id={id}
          messageApi={messageApi}
          notificationApi={notificationApi}
          openDrawer={openDrawer}
          setFile={setFile}
          setId={setId}
          setOpenDrawer={setOpenDrawer}
        />
      )}
    </AdminLayout>
  );
};

export default OutgoingLetter;
