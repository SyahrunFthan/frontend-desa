import { useTranslation } from "react-i18next";
import AdminLayout from "../../../layouts/adminLayout";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BookOutlined, DashboardOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { message, notification, Tabs, type TabsProps } from "antd";
import { NewsDetailComment, NewsDetailContent } from "../../../components";
import type { NewsModel } from "../../../models/news";
import { getNewsDetail } from "../../../apis";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";
import type {
  CommentNews,
  CommentNewsTableParams,
} from "../../../models/commentNews";
import type { StatisticNews } from "../../../models/statisticNews";

const DetailNews = () => {
  const [tableParams, setTableParams] = useState<CommentNewsTableParams>({
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
  const [activeTab, setActiveTab] = useState("news");
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<NewsModel | null>(null);
  const [commentNews, setCommentNews] = useState<CommentNews[]>([]);
  const [statistic, setStatistic] = useState<StatisticNews | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getNewsDetail({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        search: tableParams.search || "",
        id: id,
      });

      const { total, comment_news, statistic, news } = response.data;
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total,
        },
      }));
      setCommentNews(comment_news);
      setStatistic(statistic);
      setNews(news);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      processFail(
        messageApi,
        "fetchDetailNews",
        axiosError.response?.data?.message || "Server Error"
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  const handleChangeTab = (key: string) => {
    const query = new URLSearchParams();
    query.set("tab", key);
    setActiveTab(key);
    navigate({ search: query.toString() });
  };

  const tabItems: TabsProps["items"] = [
    {
      key: "news",
      label: t("news.detail.title"),
      children: (
        <NewsDetailContent
          news={news}
          statistic={statistic}
          totalComment={tableParams.pagination?.total ?? 0}
        />
      ),
    },
    {
      key: "comment_news",
      label: t("news.detail.comment.list"),
      children: (
        <NewsDetailComment
          setTableParams={setTableParams}
          t={t}
          tableParams={tableParams}
          dataSource={commentNews}
          loading={loading}
          fetchData={fetchData}
          messageApi={messageApi}
          notificationApi={notificationApi}
        />
      ),
    },
  ];

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    fetchData();
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  return (
    <AdminLayout
      pageName={news?.title}
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
            <Link to={"/admin/news"}>
              <BookOutlined />
              <span className="ml-1">{t("news.title")}</span>
            </Link>
          ),
        },
        {
          title: t("news.detail.title"),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}

      <Tabs
        items={tabItems}
        type="card"
        size="middle"
        activeKey={activeTab}
        defaultActiveKey={activeTab}
        onChange={handleChangeTab}
      />
    </AdminLayout>
  );
};

export default DetailNews;
