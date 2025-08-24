import { Card, Col, Row, Typography } from "antd";
import AppLayout from "../../../layouts/appLayout";
import {
  Building,
  Church,
  Hospital,
  LocateIcon,
  MapPin,
  School,
  ShoppingCart,
  Users,
} from "lucide-react";
import { COLORS } from "../../../assets";
import { MapView } from "../../../components";

const facilities = [
  {
    id: 1,
    name: "Kantor Desa",
    type: "Pemerintahan",
    icon: Building,
    color: "text-red-500",
    lat: -5.1477,
    lng: 119.4327,
  },
  {
    id: 2,
    name: "Puskesmas",
    type: "Kesehatan",
    icon: Hospital,
    color: "text-blue-500",
    lat: -5.1487,
    lng: 119.4337,
  },
  {
    id: 3,
    name: "SD Negeri 1",
    type: "Pendidikan",
    icon: School,
    color: "text-yellow-500",
    lat: -5.1467,
    lng: 119.4317,
  },
  {
    id: 4,
    name: "Masjid Al-Ikhlas",
    type: "Ibadah",
    icon: Church,
    color: "text-purple-500",
    lat: -5.1497,
    lng: 119.4347,
  },
  {
    id: 5,
    name: "Balai Desa",
    type: "Sosial",
    icon: Users,
    color: "text-green-500",
    lat: -5.1457,
    lng: 119.4307,
  },

  {
    id: 6,
    name: "Pasar Desa",
    type: "Ekonomi",
    icon: ShoppingCart,
    color: "text-orange-500",
    lat: -5.1507,
    lng: 119.4357,
  },
];

const MapVillagePage = () => {
  return (
    <AppLayout>
      <Row gutter={[16, 16]} className="py-24 px-4">
        <Col sm={24} xs={24} md={12} lg={8} xl={6} xxl={6}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <Building />
                <span>Daftar Fasilitas</span>
              </div>
            }
            styles={{
              header: {
                background: COLORS.primary,
                color: "#fff",
              },
            }}
          >
            <div className="p-4">
              <div className="space-y-3">
                {facilities.map((facility) => {
                  const IconComponent = facility.icon;
                  return (
                    <div
                      key={facility.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent size={20} className={facility.color} />
                        <div>
                          <div className="font-medium text-gray-900">
                            {facility.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {facility.type}
                          </div>
                        </div>
                      </div>
                      <MapPin size={16} className="text-blue-500" />
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
          <Card
            title={
              <div className="flex items-center gap-2">
                <LocateIcon />
                <span>Daftar Dusun</span>
              </div>
            }
            styles={{
              header: {
                background: COLORS.primary,
                color: "#fff",
              },
            }}
          ></Card>
        </Col>
        <Col sm={24} xs={24} md={12} lg={16} xl={18} xxl={18}>
          <Card className="h-[80vh]">
            <Typography.Title level={4}>Peta Desa</Typography.Title>

            <MapView height="850px">
              <div></div>
            </MapView>
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
};

export default MapVillagePage;
