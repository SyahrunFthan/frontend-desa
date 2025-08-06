import { DashboardOutlined } from "@ant-design/icons";
import AdminLayout from "../../../layouts/adminLayout";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Form, Tabs, type TabsProps, type UploadFile } from "antd";
import { IncomingLetterCreate, IncomingLetterList } from "../../../components";
import { useEffect, useState } from "react";
import type {
  IncomingLetterModel,
  IncomingLetterTableParams,
} from "../../../models/incomingLetter";
import useMessage from "antd/es/message/useMessage";
import useNotification from "antd/es/notification/useNotification";
import { getIncomingLetter } from "../../../apis";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";
import IncomingLetterEdit from "../../../components/incoming-letters/IncomingLetterEdit";

const IncomingLetter = () => {
  const [tableParams, setTableParams] = useState<IncomingLetterTableParams>({
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
      date_of_receipt: "",
      regarding: "",
      sender: "",
      status_letter: "",
    },
  });
  const [messageApi, contextHolder] = useMessage();
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [file, setFile] = useState<UploadFile[] | null>(null);
  const [id, setId] = useState("");
  const [dataSource, setDataSource] = useState<IncomingLetterModel[]>([]);
  const [notificationApi, contextHolderN] = useNotification();
  const [formEdit] = Form.useForm();
  const { t } = useTranslation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getIncomingLetter({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        filters: tableParams.filters,
      });
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: response.data.total,
        },
      }));
      setDataSource(response.data.incoming_letters);
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
      label: t("incoming letter list"),
      children: (
        <IncomingLetterList
          setTableParams={setTableParams}
          tableParams={tableParams}
          dataSource={dataSource}
          messageApi={messageApi}
          notificationApi={notificationApi}
          loading={loading}
          formEdit={formEdit}
          setFile={setFile}
          setId={setId}
          setOpenDrawer={setOpenDrawer}
          fetchData={fetchData}
        />
      ),
    },
    {
      key: "create",
      label: t("create"),
      children: (
        <IncomingLetterCreate
          messageApi={messageApi}
          notificationApi={notificationApi}
          fetchData={fetchData}
        />
      ),
    },
  ];

  return (
    <AdminLayout
      pageName={t("incoming letter")}
      breadCrumbs={[
        {
          title: (
            <Link to={"/admin/dashboard"} className="flex">
              <DashboardOutlined />
              <span className="ml-1">{t("dashboard")}</span>
            </Link>
          ),
        },
        {
          title: t("incoming letter"),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}
      <Tabs items={items} type="card" size="middle" />

      {openDrawer && (
        <IncomingLetterEdit
          messageApi={messageApi}
          file={file}
          form={formEdit}
          notificationApi={notificationApi}
          openDrawer={openDrawer}
          setFile={setFile}
          setOpenDrawer={setOpenDrawer}
          id={id}
          setId={setId}
          fetchData={fetchData}
        />
      )}
    </AdminLayout>
  );
};

export default IncomingLetter;
