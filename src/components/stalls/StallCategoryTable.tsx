import { Button, Card, Col, Flex, Input, Row, Table, Typography } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { TFunction } from "i18next";
import { useEffect, useState } from "react";
import type {
  StallCategoryModel,
  StallCategoryTableParams,
} from "../../models/stallCategory";
import { stallCategoryColumns } from "../../constants/stallColumns";
import { SearchOutlined } from "@ant-design/icons";
import { getStallCategory } from "../../apis";
import {
  processFail,
  processFinish,
  processStart,
} from "../../helpers/process";
import type { AxiosError } from "axios";
import StallCategoryForm from "./StallCategoryForm";
import { stallCategoryDeleted } from "../../services/stallCategory";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  t: TFunction;
  activeTab: string;
}

const StallCategoryTable = (params: Props) => {
  const { messageApi, notificationApi, t, activeTab } = params;

  const [tableParams, setTableParams] = useState<StallCategoryTableParams>({
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
  });
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [record, setRecord] = useState<StallCategoryModel | null>(null);
  const [dataSource, setDataSource] = useState<StallCategoryModel[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getStallCategory({
        current: tableParams.pagination?.current ?? 1,
        pageSize: tableParams.pagination?.pageSize ?? 5,
        search: tableParams.search ?? "",
      });

      const { total, stallCategories } = response.data;
      setDataSource(stallCategories);
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
        "fetchDataStallCategory",
        axiosError.response?.data?.message || "Server Error"
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  const handleDelete = (id: string) => {
    stallCategoryDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const handleEdit = (record: StallCategoryModel) => {
    processStart(messageApi, "editStallCategory", "Loading Data");
    processFinish(messageApi, () => {
      setRecord(record);
    });
  };

  const columns = stallCategoryColumns({
    handleDelete,
    handleEdit,
    processing,
    t,
    tableParams,
  });

  useEffect(() => {
    fetchData();
  }, [
    activeTab === "stall_category",
    tableParams.pagination?.pageSize,
    tableParams.pagination?.current,
  ]);

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col sm={24} xs={24} md={12} lg={12} xl={8} xxl={8}>
          <StallCategoryForm
            messageApi={messageApi}
            notificationApi={notificationApi}
            fetchData={fetchData}
            record={record}
            setRecord={setRecord}
            t={t}
          />
        </Col>
        <Col sm={24} xs={24} md={12} lg={12} xl={16} xxl={16}>
          <Typography.Title level={3}>
            {t("stall_category.list")}
          </Typography.Title>

          <Flex gap={"small"} className="mb-5 w-full lg:w-[25%]">
            <Input
              placeholder="Search"
              value={tableParams.search}
              onChange={(e) =>
                setTableParams((prev) => ({ ...prev, search: e.target.value }))
              }
              onPressEnter={() => fetchData()}
            />
            <Button type="default" onClick={() => fetchData()}>
              <SearchOutlined />
            </Button>
          </Flex>

          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={tableParams.pagination}
            loading={loading}
            rowKey={"id"}
            scroll={{ x: "max-content" }}
            bordered
            onChange={(pagination) => {
              setTableParams((prev) => ({
                ...prev,
                pagination: {
                  pageSize: pagination.pageSize,
                  current: pagination.current,
                },
              }));
            }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default StallCategoryTable;
