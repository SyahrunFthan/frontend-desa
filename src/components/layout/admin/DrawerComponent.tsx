import { LogoutOutlined, PieChartOutlined } from "@ant-design/icons";
import { Drawer, Popconfirm } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { menuItems } from "../../../constants/menu";
import { useTranslation } from "react-i18next";

interface DrawerProps {
  isOpenDrawer: boolean;
  onClose: () => void;
  onClickLogout: () => void;
}

const DrawerComponent: React.FC<DrawerProps> = ({
  isOpenDrawer,
  onClose,
  onClickLogout,
}) => {
  const { t } = useTranslation();
  const items = menuItems(t);
  return (
    <Drawer
      open={isOpenDrawer}
      width={340}
      placement="left"
      onClose={onClose}
      closeIcon={false}
      title={
        <div className="h-16 flex items-center gap-4 bg-white z-10">
          <div className="bg-green-200 rounded-md p-2">
            <PieChartOutlined className="text-xl text-green-600" />
          </div>
          <div>
            <h1 className="text-lg">Administrator</h1>
            <p className="text-gray-400">Admin</p>
          </div>
        </div>
      }
    >
      <div className="flex-1 px-2 mt-4">
        {items.map((menu, index) => (
          <div key={index} className="mb-4">
            <div className="px-4 py-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
              {menu.title}
            </div>
            <div className="space-y-1">
              {menu.items.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    to={item.path}
                    key={item.path}
                    className={`flex items-center w-full px-5 rounded-md py-3 text-left transition-all duration-200 ease-in-out
                  ${isActive ? "bg-blue-100 text-blue-600" : ""}
                  hover:bg-blue-50 hover:text-blue-600`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="ml-3 font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t mb-10 pt-4 px-2 flex flex-col gap-2">
        <Popconfirm
          onConfirm={onClickLogout}
          title="Anda yakin keluar aplikasi?"
          description="Jika ya, silahkan klik ok"
          className="flex items-center w-full bg-transparent border-none p-0 m-0 text-left outline-none focus:outline-none hover:bg-gray-50 cursor-pointer transition rounded-md gap-4 px-3"
        >
          <div className="bg-red-200 rounded-md p-2">
            <LogoutOutlined className="text-xl text-red-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg">{t("sign out")}</h1>
            <p className="text-gray-400">{t("sign out")}</p>
          </div>
        </Popconfirm>
      </div>
    </Drawer>
  );
};

export default DrawerComponent;
