import { Card, Col, Form, message, notification, Row, Typography } from "antd";
import AdminLayout from "../../../layouts/adminLayout";
import { DashboardOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  processFail,
  processFinish,
  processStart,
} from "../../../helpers/process";
import type { RoleModel, RoleTableParams } from "../../../models/role";
import { getRole } from "../../../apis";
import { roleDeleted } from "../../../services/role";
import { RoleForm, RoleTable } from "../../../components";
import roleColumns from "../../../constants/roleColumns";
import { Link } from "react-router-dom";

const Role = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const [tableParams, setTableParams] = useState<RoleTableParams>({
    pagination: {
      showTotal: (total, range) =>
        `${range[0]} - ${range[1]} of ${total} items`,
      pageSizeOptions: ["5", "10", "20", "50", "100"],
      showSizeChanger: true,
      total: 0,
      pageSize: 5,
      current: 1,
    },
  });
  const [id, setId] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleDelete = (id: string) => {
    roleDeleted({
      setProcessing,
      messageApi,
      id,
      notificationApi,
      fetchData: fetchRole,
    });
  };

  const handleEdit = (record: RoleModel) => {
    processStart(messageApi, "editRole", "Editing Role");
    processFinish(messageApi, () => {
      setId(record?.id || "");
      setTimeout(() => {
        form.setFieldsValue(record);
      }, 100);
    });
  };

  const fetchRole = async () => {
    try {
      setLoading(true);

      const pageSize = tableParams.pagination?.pageSize || 5;
      const current = tableParams.pagination?.current || 1;

      const response = await getRole(pageSize, current);

      if (response?.status === 200) {
        setDataSource(response.data.response);
        setTableParams((prev) => ({
          pagination: {
            ...prev.pagination,
            total: response.data.total,
          },
        }));
      } else {
        throw new Error(response?.data?.message || "error");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Terjadi kesalahan saat memuat data";

      processFail(messageApi, "fetchRole", errorMessage || "Error server");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  useEffect(() => {
    fetchRole();
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  return (
    <AdminLayout
      pageName="Roles"
      breadCrumbs={[
        {
          title: (
            <Link to={"/admin/dashboard"}>
              <DashboardOutlined />
              <span className="ml-1">Dashboard</span>
            </Link>
          ),
        },
        {
          title: (
            <div className="flex items-center gap-1">
              <span>Role</span>
            </div>
          ),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}

      <Card>
        <Typography.Title level={3}>List Role</Typography.Title>

        <Row gutter={[16, 16]}>
          <Col sm={24} xs={24} md={12} lg={12} xl={10} xxl={10}>
            <RoleForm
              form={form}
              messageApi={messageApi}
              notificationApi={notificationApi}
              fetchData={fetchRole}
              setId={setId}
              id={id}
            />
          </Col>
          <Col sm={24} xs={24} md={12} lg={12} xl={14} xxl={14}>
            <RoleTable
              messageApi={messageApi}
              notificationApi={notificationApi}
              tableParams={tableParams}
              dataSource={dataSource}
              fetchData={fetchRole}
              loading={loading}
              setTableParams={setTableParams}
              columns={roleColumns({
                handleDelete,
                processing,
                tableParams,
                handleEdit,
              })}
            />
          </Col>
        </Row>
      </Card>
    </AdminLayout>
  );
};

export default Role;
