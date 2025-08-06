import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Grid, Layout, Space } from "antd";
import React, { useEffect, useState } from "react";
import ModalProfile from "./profileModal";
import LanguageSwitcher from "../../locales/LanguageSwitcher";
import enUS from "antd/locale/en_US";
import idID from "antd/locale/id_ID";

const { Header } = Layout;
const { useBreakpoint } = Grid;

interface Props {
  collapsed?: boolean;
  isOpenDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  setCollapsed: (collapsed: boolean) => void;
  setLocale: (locale: typeof enUS | typeof idID) => void;
  onLogout: () => void;
}

const NavbarComponent: React.FC<Props> = ({
  collapsed,
  setCollapsed,
  onLogout,
  setOpenDrawer,
  isOpenDrawer,
  setLocale,
}) => {
  const [action, setAction] = useState({
    isModalProfile: false,
    isModalNotification: false,
  });

  const screens = useBreakpoint();

  useEffect(() => {
    if (screens.md) {
      setOpenDrawer(false);
    }
  }, [screens, setOpenDrawer]);

  return (
    <Header className="bg-white flex justify-between items-center py-0 px-4">
      {!screens.lg && (
        <Button
          type="text"
          icon={isOpenDrawer ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setOpenDrawer(!isOpenDrawer)}
          style={{ fontSize: 18 }}
        />
      )}

      {screens.lg && (
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: 18 }}
        />
      )}

      <Space size={24} wrap>
        <LanguageSwitcher onChangeAntdLocale={setLocale} />
        <button
          onClick={() =>
            setAction((prev) => ({ ...prev, isModalProfile: true }))
          }
        >
          <Avatar
            className="bg-green-200"
            icon={<UserOutlined className="text-green-700" />}
          />
        </button>
      </Space>

      <ModalProfile
        onLogout={onLogout}
        visible={action.isModalProfile}
        onClick={() =>
          setAction((prev) => ({ ...prev, isModalProfile: false }))
        }
      />
    </Header>
  );
};

export default NavbarComponent;
