import { DashboardOutlined } from "@ant-design/icons";
import AdminLayout from "../../../layouts/adminLayout";
import { Form, message, notification, Tabs, type TabsProps } from "antd";
import { UserCreate, UserEdit, UserList } from "../../../components";
import { useEffect, useState } from "react";
import { getUser } from "../../../apis";
import type { UserModel, UserTableParams } from "../../../models/user";
import type { AxiosError } from "axios";
import {
  processFail,
  processFinish,
  processStart,
} from "../../../helpers/process";
import type { RoleModel } from "../../../models/role";
import type { Option } from "../../../models/global";
import userColumns from "../../../constants/userColumns";
import { userDeleted } from "../../../services/user";
import { Link } from "react-router-dom";

const User = () => {
  const [roleOptions, setRoleOptions] = useState<Option[]>([]);
  const [residentOptions, setResidentOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState("");
  const [tableParams, setTableParams] = useState<UserTableParams>({
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
      username: "",
      email: "",
    },
  });
  const [dataSource, setDataSource] = useState<UserModel[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const [formCreate] = Form.useForm();
  const [formEdit] = Form.useForm();

  const handleDelete = (id: string) => {
    userDeleted({
      fetchData: fetchUser,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };
  const handleEdit = (record: UserModel) => {
    processStart(messageApi, "userEdited", "Editing User");
    processFinish(messageApi, () => {
      setIsOpen(true);
      setId(record?.id);
      setTimeout(() => {
        formEdit.setFieldsValue({
          username: record.username,
          email: record.email,
          role_id: record.role_id,
          resident_id: record.resident_id,
        });
      }, 200);
    });
  };

  const columns = userColumns({
    handleDelete,
    handleEdit,
    processing,
    tableParams,
    setTableParams,
  });

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await getUser({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        filters: {
          username: tableParams.filters?.username,
          email: tableParams.filters?.email,
        },
      });
      const optionRoles = response?.data?.roles.map((item: RoleModel) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      const optionResidents = response?.data?.residents.map((item: any) => {
        return {
          label: item.fullname,
          value: item.id,
        };
      });

      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: response?.data?.total,
        },
      }));
      setDataSource(response?.data?.response);
      setRoleOptions(optionRoles);
      setResidentOptions(optionResidents);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      processFail(
        messageApi,
        "fetchUser",
        axiosError?.response?.data?.message || "Error server."
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [
    tableParams.filters,
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
  ]);

  const tabItems: TabsProps["items"] = [
    {
      label: "List Users",
      key: "list",
      children: (
        <UserList
          dataSource={dataSource}
          tableParams={tableParams}
          tableColumns={columns}
          loading={loading}
          setTableParams={setTableParams}
        />
      ),
    },
    {
      label: "Create",
      key: "create",
      children: (
        <UserCreate
          roleOptions={roleOptions}
          form={formCreate}
          messageApi={messageApi}
          notificationApi={notificationApi}
          fetchData={fetchUser}
          residentOptions={residentOptions}
        />
      ),
    },
  ];

  return (
    <AdminLayout
      pageName="Users"
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
              <span>User</span>
            </div>
          ),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}
      <Tabs
        items={tabItems}
        defaultActiveKey="list"
        type="card"
        size="middle"
      />

      {isOpen && (
        <UserEdit
          isOpen={isOpen}
          form={formEdit}
          setIsOpen={setIsOpen}
          roleOptions={roleOptions}
          id={id}
          messageApi={messageApi}
          notificationApi={notificationApi}
          setId={setId}
          fetchData={fetchUser}
          residentOptions={residentOptions}
        />
      )}
    </AdminLayout>
  );
};

export default User;
