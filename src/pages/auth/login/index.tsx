import React, { useState } from "react";
import { Home } from "lucide-react";
import { Form, Input, message, notification } from "antd";
import { userLogin } from "../../../services/auth";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [processing, setProcessing] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00a3a3] to-[#005f5f] flex items-center justify-center p-4 relative overflow-hidden">
      {contextHolder}
      {contextHolderN}
      <div className="absolute inset-0 opacity-5 animate-pulse">
        <div
          className="absolute inset-0 bg-repeat opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
      <div className="absolute top-32 right-16 w-16 h-16 bg-white/5 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/5 rounded-full animate-ping"></div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative backdrop-blur-sm transform transition-all duration-700 hover:shadow-3xl animate-slideUp">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#00a3a3] to-[#005f5f] rounded-2xl flex items-center justify-center shadow-lg relative group">
              <Home className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -inset-1 bg-gradient-to-br from-[#00a3a3] to-[#005f5f] rounded-3xl opacity-30 animate-ping"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#005f5f] mb-2 hover:text-[#00a3a3] transition-colors duration-300">
            Village Information System
          </h1>
          <p className="text-[#9e9e9e] text-base">Sign in to admin panel</p>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => {
            const selfData = {
              username: String(values.username) || "",
              password: values.password || "",
            };

            userLogin({
              data: selfData,
              form,
              messageApi,
              navigate,
              notificationApi,
              setProcessing,
            });
          }}
        >
          <Form.Item
            name={"username"}
            label="Username:"
            required
            rules={[
              {
                pattern: /^[0-9]+$/,
                message: "Username hanya boleh berupa angka",
              },
            ]}
          >
            <Input placeholder="Ex: 028312" />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <label className="block text-sm font-semibold text-[#005f5f]">
                Password
              </label>
            }
          >
            <Input.Password placeholder="Enter your password" size="large" />
          </Form.Item>

          <div className="text-right mb-3">
            <button
              type="button"
              className="text-sm text-[#00a3a3] hover:text-[#005f5f] hover:underline font-medium transition-all duration-300 hover:scale-105"
            >
              Forgot Password?
            </button>
          </div>

          <button
            disabled={processing}
            type="submit"
            className="w-full bg-gradient-to-r from-[#00a3a3] to-[#005f5f] text-white py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-[#00a3a3]/30 transform hover:-translate-y-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center">
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Loading...
                </>
              ) : (
                "Sign In"
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </Form>

        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-[#d4d4d4]"></div>
          <span className="px-4 text-sm text-[#9e9e9e] bg-white">Or</span>
          <div className="flex-1 border-t border-[#d4d4d4]"></div>
        </div>

        <div className="text-center text-sm text-[#9e9e9e]">
          Don't have an account yet?{" "}
          <button className="text-[#00a3a3] hover:text-[#005f5f] hover:underline font-medium transition-all duration-300 hover:scale-105">
            Contact Admin
          </button>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-slideUp {
            animation: slideUp 0.8s ease-out;
          }
          
          .shadow-3xl {
            box-shadow: 0 25px 50px -12px rgba(0, 163, 163, 0.25);
          }
        `,
        }}
      />
    </div>
  );
};

export default Login;
