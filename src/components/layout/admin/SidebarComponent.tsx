import React, { useState } from "react";
import { Grid, Layout, Popconfirm } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { ILLogoImage } from "../../../assets";
import { menuItems } from "../../../constants/menu";
import { useTranslation } from "react-i18next";

const { Sider } = Layout;
const { useBreakpoint } = Grid;

interface Props {
  collapsed?: boolean;
  processing: boolean;
  onClickLogout: () => void;
}

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "none",
  scrollbarGutter: "stable",
};

const SidebarComponent: React.FC<Props> = ({
  collapsed,
  onClickLogout,
  processing,
}) => {
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const location = useLocation();
  const { lg } = useBreakpoint();
  const { t } = useTranslation();
  const items = menuItems(t);

  return (
    <Sider
      width={280}
      className="bg-white shadow-sm"
      trigger={null}
      collapsible
      style={siderStyle}
      collapsed={collapsed}
      hidden={lg ? false : true}
    >
      <div
        className={`
              flex items-center justify-between
              p-4 border-b border-gray-200
              h-16 ml-1
              ${collapsed ? "flex-col justify-center" : ""}
            `}
        onMouseEnter={() => setIsHoveringLogo(true)}
        onMouseLeave={() => setIsHoveringLogo(false)}
      >
        <div className={`flex items-center ${collapsed ? "flex-col" : ""}`}>
          <div
            className={`
                flex items-center justify-center
                w-10 h-10 rounded-lg
                text-teal-600
                ${isHoveringLogo ? "animate-pulse" : ""}
              `}
          >
            <a href="/">
              <img src={ILLogoImage} />
            </a>
          </div>
          <div
            className={`
                ml-3 transition-opacity duration-300
                ${collapsed ? "opacity-0 absolute" : "opacity-100"}
                ${isHoveringLogo ? "text-teal-600" : "text-gray-800"}
              `}
          >
            <h1 className="font-semibold text-lg">Administrator</h1>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 mt-4">
        {items.map((menu, index) => (
          <div key={index} className="mb-4">
            {!collapsed && (
              <div className="px-4 py-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                {menu.title}
              </div>
            )}
            <div className="space-y-1">
              {menu.items.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    to={item.path}
                    key={item.path}
                    className={`flex items-center w-full px-5 rounded-md py-3 text-left transition-all duration-200 ease-in-out
                  ${isActive ? "bg-blue-100 text-blue-600" : ""}
                  hover:bg-blue-50 hover:text-blue-600
                  ${collapsed ? "justify-center" : ""}`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!collapsed && (
                      <span className="ml-3 font-medium">{item.label}</span>
                    )}
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
          disabled={processing}
          title="Anda yakin keluar aplikasi?"
          description="Jika ya, silahkan klik ok"
          className="flex items-center w-full cursor-pointer bg-transparent border-none p-0 m-0 text-left outline-none focus:outline-none hover:bg-gray-50 transition rounded-md gap-4 px-3 mb-2"
        >
          <div className="bg-red-200 rounded-md p-2">
            <LogoutOutlined className="text-xl text-black" />
          </div>
          {!collapsed && (
            <div className="flex-1">
              <a type="button">
                <h1 className="text-md font-semibold">{t("sign out")}</h1>
              </a>
              <p className="text-gray-400">{t("sign out")}</p>
            </div>
          )}
        </Popconfirm>
      </div>
    </Sider>
  );
};

export default SidebarComponent;
