import AdminLayout from "../../../layouts/adminLayout";
import { DashboardOutlined } from "@ant-design/icons";
import { message, notification, Tabs, type TabsProps } from "antd";
import { Link } from "react-router-dom";
import {
  EmployeeCreate,
  EmployeeEdit,
  EmployeeList,
} from "../../../components";
import { useEffect, useState } from "react";
import {
  employeeState,
  type EmployeeModel,
  type EmployeeTableParams,
} from "../../../models/employee";
import { getEmployee } from "../../../apis";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";

const Employee = () => {
  const [tableParams, setTableParams] = useState<EmployeeTableParams>({
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
      employee_id: "",
      fullname: "",
      gender: "",
      position: "",
      religion: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [dataSource, setDataSource] = useState<EmployeeModel[]>([]);
  const [record, setRecord] = useState<EmployeeModel>(employeeState);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await getEmployee({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        filters: tableParams.filters,
      });

      setDataSource(response.data.employees);
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
      label: "List Employee",
      children: (
        <EmployeeList
          dataSource={dataSource}
          loading={loading}
          setTableParams={setTableParams}
          tableParams={tableParams}
          messageApi={messageApi}
          notificationApi={notificationApi}
          setOpenDrawer={setOpenDrawer}
          fetchData={fetchData}
          setRecord={setRecord}
        />
      ),
    },
    {
      key: "create",
      label: "Create",
      children: (
        <EmployeeCreate
          messageApi={messageApi}
          notificationApi={notificationApi}
          fetchData={fetchData}
        />
      ),
    },
  ];

  return (
    <AdminLayout
      pageName="Employees"
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
              <span>Employee</span>
            </div>
          ),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}

      <Tabs items={items} type="card" size="middle" />

      {openDrawer && (
        <EmployeeEdit
          fetchData={fetchData}
          setOpenDrawer={setOpenDrawer}
          messageApi={messageApi}
          notificationApi={notificationApi}
          openDrawer={openDrawer}
          record={record}
          setRecord={setRecord}
        />
      )}
    </AdminLayout>
  );
};

export default Employee;
