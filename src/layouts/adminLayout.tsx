import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  ConfigProvider,
  Layout,
  message,
  notification,
  Typography,
} from "antd";

import { useNavigate } from "react-router-dom";
import {
  DrawerComponent,
  NavbarComponent,
  SidebarComponent,
} from "../components/layout";
import { getItem, setItem } from "../helpers/storage";
import { Loading } from "../components";
import type { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { userLogout } from "../services/auth";
import enUS from "antd/locale/en_US";
import idID from "antd/locale/id_ID";
import { useTranslation } from "react-i18next";

const { Content, Footer } = Layout;

interface Props {
  children: React.ReactNode;
  title?: string;
  pageName?: string;
  breadCrumbs?: ItemType[];
}

const AdminLayout: React.FC<Props> = ({
  children,
  pageName = "",
  breadCrumbs,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return getItem("collapsed") ?? false;
  });
  const [locale, setLocale] = useState<typeof enUS | typeof idID>(() => {
    const stored = getItem("locale");
    return stored === "en" ? enUS : idID;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { i18n: i18next } = useTranslation();

  const handleLogout = async () => {
    userLogout({
      messageApi,
      notificationApi,
      navigate,
      setProcessing,
    });
  };

  useEffect(() => {
    setItem({
      key: "collapsed",
      value: collapsed,
    });
  }, [collapsed]);

  useEffect(() => {
    const stored = getItem("locale") || "id";
    i18next.changeLanguage(stored);
  }, [i18next]);

  if (isLoading) return <Loading setIsLoading={setIsLoading} />;

  return (
    <ConfigProvider locale={locale}>
      <Layout hasSider>
        {contextHolder}
        {contextHolderN}
        <SidebarComponent
          collapsed={collapsed}
          onClickLogout={handleLogout}
          processing={processing}
        />

        <DrawerComponent
          onClickLogout={handleLogout}
          isOpenDrawer={isOpenDrawer}
          onClose={() => setIsOpenDrawer(false)}
        />

        <Layout style={{ minHeight: "100vh" }}>
          <div className="sticky top-0 z-50 bg-white">
            <NavbarComponent
              onLogout={handleLogout}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              setOpenDrawer={setIsOpenDrawer}
              isOpenDrawer={isOpenDrawer}
              setLocale={setLocale}
            />
          </div>
          <Content className="bg-gray-100 py-6 px-5">
            {pageName && (
              <Typography.Title level={2}>{pageName}</Typography.Title>
            )}
            <Breadcrumb
              style={{ margin: "16px 0", fontSize: 16 }}
              items={breadCrumbs && breadCrumbs.length > 0 ? breadCrumbs : []}
            />
            <main className="flex-1 overflow-y-auto p-4 overflow-x-hidden">
              {children}
            </main>
          </Content>

          <Footer className="bg-white text-center">
            <p className="text-sm text-gray-400">
              &copy; Desa Sikara Tobata Kabupaten Donggala
            </p>
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminLayout;
