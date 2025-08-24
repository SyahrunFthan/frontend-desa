import { Card, Col, message, Row } from "antd";
import AppLayout from "../../../layouts/appLayout";
import {
  Activity,
  BookOpen,
  Briefcase,
  CalendarClock,
  Users,
} from "lucide-react";
import { COLORS } from "../../../assets";
import { useEffect, useMemo, useState } from "react";
import type { ItemStatistic } from "../../../models/global";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AgeGroupStatistic,
  GenderStatistic,
  JobStatistic,
  ReligionStatistic,
  ResidentMainStatistic,
} from "../../../components";

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
      icon: <Activity />,
      children: <ResidentMainStatistic messageApi={messageApi} />,
    },
    {
      key: "statistic_jobs",
      title: "Statistik Berdasarkan Pekerjaan",
      description: "Lihat Statistik Pekerjaan Terbaru",
      icon: <Briefcase />,
      children: <JobStatistic messageApi={messageApi} />,
    },
    {
      key: "statistic_gender",
      title: "Statistik Berdasarkan Jenis Kelamin",
      description: "Lihat Statistik Jenis Kelamin Terbaru",
      icon: <Users />,
      children: <GenderStatistic messageApi={messageApi} />,
    },
    {
      key: "statistic_religion",
      title: "Statistik Berdasarkan Agama",
      description: "Lihat Statistik Agama Terbaru",
      icon: <BookOpen />,
      children: <ReligionStatistic messageApi={messageApi} />,
    },
    {
      key: "statistic__age",
      title: "Statistik Kelompok Umur",
      description: "Lihat Statistik Kelompok Umur Terbaru",
      icon: <CalendarClock />,
      children: <AgeGroupStatistic messageApi={messageApi} />,
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
                  className={`group p-4 rounded-xl border border-blue-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer bg-white hover:bg-blue-50 ${
                    activeKey === item.key &&
                    " transition-all duration-300 shadow-lg bg-blue-400/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg bg-primary text-white shadow-sm group-hover:scale-110 transition-transform duration-200`}
                      >
                        {item.icon}
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
