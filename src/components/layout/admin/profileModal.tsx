import {
  CloseOutlined,
  LockOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Popconfirm } from "antd";
import React from "react";
import { Link } from "react-router-dom";

interface ProfileModalProps {
  visible?: boolean;
  mobile?: boolean;
  onClick?: () => void;
  onLogout: () => void;
  user?: string;
  role?: string;
}

const ModalProfile: React.FC<ProfileModalProps> = ({
  visible = false,
  onClick,
  mobile = false,
  user,
  role,
  onLogout,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-end ${
        !visible && "hidden"
      }`}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClick}
      />

      <div
        className={`bg-white relative rounded-lg shadow-xl overflow-hidden ${
          mobile ? "w-full h-full" : "w-80 h-auto max-h-[80vh] mt-16 mr-4"
        }`}
      >
        <div className="flex items-center justify-between px-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">My Profile</h3>
          <button onClick={onClick}>
            <CloseOutlined />
          </button>
        </div>

        <div
          className={`${
            mobile ? "h-[calc(100%-120px)]" : "max-h-[60vh]"
          } overflow-y-auto p-4`}
        >
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mb-3">
              <UserOutlined className="text-2xl" />
            </div>
            <h4 className="text-lg font-semibold">{user}</h4>
            <p className="text-sm text-gray-500">{role}</p>
          </div>

          <div className="space-y-0">
            <Link
              to={"/admin/change-password"}
              className="w-full flex items-center px-3 rounded-lg hover:bg-gray-100"
            >
              <LockOutlined className="mr-3 text-gray-600" />
              <span className="text-gray-800">Change Password</span>
            </Link>
            <Popconfirm
              title="Anda yakin keluar aplikasi?"
              onConfirm={onLogout}
            >
              <button className="w-full flex items-center px-3 rounded-lg hover:bg-gray-100 text-red-500">
                <LogoutOutlined className="mr-3" />
                <span>Sign Out</span>
              </button>
            </Popconfirm>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 text-center text-xs text-gray-500">
          AdminPanel
        </div>
      </div>
    </div>
  );
};

export default ModalProfile;
