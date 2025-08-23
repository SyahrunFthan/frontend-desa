import { Card, Col, message, Row } from "antd";
import AppLayout from "../../../layouts/appLayout";
import { Activity, TrendingUp } from "lucide-react";
import { COLORS } from "../../../assets";
import { useEffect, useMemo, useState } from "react";
import type { ItemStatistic } from "../../../models/global";
import { useLocation, useNavigate } from "react-router-dom";
import { JobStatistic, ResidentMainStatistic } from "../../../components";

const StatisticPage = () => {
  const [activeKey, setActiveKey] = useState("statistic_resident");
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChangeTab = (item: string) => {
    const query = new URLSearchParams();
    query.set("tab", item);
    setActiveKey(item);
    navigate({ search: query.toString() });
  };

  const itemStatistics: ItemStatistic[] = [
    {
      key: "statistic_resident",
      title: "Statistik Penduduk",
      description: "Lihat Statistik Penduduk Terbaru",
      children: <ResidentMainStatistic messageApi={messageApi} />,
    },
    {
      key: "statistic_jobs",
      title: "Statistik Berdasarkan Pekerjaan",
      description: "Lihat Statistik Pekerjaan Terbaru",
      children: <JobStatistic messageApi={messageApi} />,
    },
    {
      key: "statistic_gender",
      title: "Statistik Berdasarkan Jenis Kelamin",
      description: "Lihat Statistik Jenis Kelamin Terbaru",
      children: "",
    },
    {
      key: "statistic_religion",
      title: "Statistik Berdasarkan Agama",
      description: "Lihat Statistik Agama Terbaru",
      children: "",
    },
    {
      key: "statistic__age",
      title: "Statistik Kelompok Umur",
      description: "Lihat Statistik Kelompok Umur Terbaru",
      children: "",
    },
  ];

  const activeItem = useMemo(
    () => itemStatistics.find((i) => i.key === activeKey),
    [activeKey]
  );

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get("tab");
    if (tab) {
      setActiveKey(tab);
    }
  }, [location.search]);

  return (
    <AppLayout>
      {contextHolder}

      <Row gutter={[16, 16]} className="py-24 px-4">
        <Col sm={24} xs={24} md={12} lg={6} xl={4} xxl={4}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <Activity />
                <span>Daftar Statistik</span>
              </div>
            }
            styles={{
              header: {
                background: COLORS.primary,
                color: "#fff",
              },
            }}
          >
            <div className="p-4 space-y-3">
              {itemStatistics.map((item) => (
                <div
                  onClick={() => handleChangeTab(item.key)}
                  key={item.key}
                  className={`group p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer bg-white hover:bg-gray-50 ${
                    activeKey === item.key &&
                    " shadow-xl transition-all duration-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg bg-primary text-white shadow-sm group-hover:scale-110 transition-transform duration-200`}
                      >
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm group-hover:text-gray-900">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col sm={24} xs={24} md={12} lg={18} xl={20} xxl={20}>
          <Card>{activeItem?.children}</Card>
        </Col>
      </Row>
    </AppLayout>
  );
};

export default StatisticPage;
