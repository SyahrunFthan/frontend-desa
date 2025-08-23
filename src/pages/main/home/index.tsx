import AppLayout from "../../../layouts/appLayout";
import { ILBackgroundImage } from "../../../assets";
import {
  CheckCircleOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import { Button } from "antd";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={ILBackgroundImage}
            alt="Pemandangan Desa Sikara Tobeta"
            className="w-full h-full object-cover object-center"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-teal-800/60"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 h-full flex flex-col pt-24 pb-16 sm:pt-36 sm:pb-20">
          <div className="flex-grow flex flex-col justify-center">
            <div className="max-w-2xl">
              <div className="mb-8">
                <span className="inline-block bg-teal-400/20 text-teal-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <CheckCircleOutlined className="mr-1" /> Selamat Datang
                </span>
                <Title
                  level={1}
                  className="text-4xl md:text-5xl lg:text-6xl !font-bold !text-white leading-tight mb-4"
                >
                  Official Website <br />
                  <span className="text-teal-300">Desa Sikara Tobata</span>
                </Title>
                <Paragraph className="text-lg text-blue-100 opacity-90 mb-8">
                  Portal informasi dan layanan digital pemerintahan desa yang
                  transparan dan akrab dengan masyarakat.
                </Paragraph>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  htmlType="button"
                  onClick={() => navigate("/auth/login")}
                  type="primary"
                  className="!bg-teal-400/90 !scroll-smooth !hover:bg-teal-500 text-gray-700 font-semibold px-6 py-3 h-auto rounded-lg transition-all shadow-lg  flex items-center justify-center"
                  icon={<SafetyCertificateOutlined />}
                  size="large"
                >
                  Admin Panel
                </Button>
                <Button
                  htmlType="button"
                  type="primary"
                  className="!bg-purple-400/90 !scroll-smooth !hover:bg-purple-500 text-gray-700 font-semibold px-6 py-3 h-auto rounded-lg transition-all shadow-lg  flex items-center justify-center"
                  icon={<Download />}
                  size="large"
                >
                  <a
                    href="/assets/nusadesa.apk"
                    download
                    className="text-inherit no-underline"
                  >
                    Download Aplikasi
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default HomePage;
