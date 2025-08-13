import { Card, Col, Drawer, Row, Typography } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { TFunction } from "i18next";
import { useEffect, useState } from "react";
import type {
  AssistanceCategoryModel,
  AssistanceCategoryTableParams,
} from "../../models/assistanceCategory";
import { getAssistanceCategory } from "../../apis";
import type { AxiosError } from "axios";
import { processFail } from "../../helpers/process";
import AssistanceCategoryTable from "./AssistanceCategoryTable";
import AssistanceCategoryCreate from "./AssistanceCategoryCreate";
import AssistanceCategoryEdit from "./AssistanceCategoryEdit";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  t: TFunction;
}

const AssistanceCategory = ({ messageApi, notificationApi, t }: Props) => {
  const [tableParams, setTableParams] = useState<AssistanceCategoryTableParams>(
    {
      pagination: {
        showTotal: (total, range) =>
          `${range[0]} - ${range[1]} of ${total} items`,
        pageSizeOptions: ["5", "10", "20", "50", "100"],
        showSizeChanger: true,
        total: 0,
        pageSize: 5,
        current: 1,
      },
      search: "",
    }
  );
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [record, setRecord] = useState<AssistanceCategoryModel>({
    amount: 0,
    description: "",
    name: "",
    type_assistance: "",
    id: "",
    year: 0,
    status: "",
  });
  const [dataSource, setDataSource] = useState<AssistanceCategoryModel[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAssistanceCategory({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        search: tableParams.search || "",
      });
      const { total, assistanceCategories } = response.data;
      setDataSource(assistanceCategories);
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
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col sm={24} xs={24} lg={12} md={12} xl={10} xxl={10}>
          <AssistanceCategoryCreate
            fetchData={fetchData}
            messageApi={messageApi}
            notificationApi={notificationApi}
            t={t}
          />
        </Col>
        <Col sm={24} xs={24} lg={12} md={12} xl={14} xxl={14}>
          <Typography.Title level={3}>
            {t("social_assistance.category.list")}
          </Typography.Title>
          <AssistanceCategoryTable
            dataSource={dataSource}
            loading={loading}
            setTableParams={setTableParams}
            t={t}
            tableParams={tableParams}
            fetchData={fetchData}
            messageApi={messageApi}
            notificationApi={notificationApi}
            setOpenDrawer={setOpenDrawer}
            setRecord={setRecord}
          />
        </Col>
      </Row>

      <Drawer
        open={openDrawer}
        closable={false}
        title={t("social_assistance.category.edit")}
      >
        <AssistanceCategoryEdit
          messageApi={messageApi}
          notificationApi={notificationApi}
          record={record}
          setOpenDrawer={setOpenDrawer}
          setRecord={setRecord}
          fetchData={fetchData}
          t={t}
        />
      </Drawer>
    </Card>
  );
};

export default AssistanceCategory;
