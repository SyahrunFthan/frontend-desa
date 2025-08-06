import type { FormInstance } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { AuthForm } from "../models/auth";
import {
  processErrorN,
  processFail,
  processFinish,
  processStart,
  processSuccessN,
} from "../helpers/process";
import { login, logout } from "../apis";
import { removeItem, setItem } from "../helpers/storage";
import { jwtDecode } from "jwt-decode";
import type { NavigateFunction } from "react-router-dom";
import type { AxiosError } from "axios";

interface LoginProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  data: AuthForm;
  navigate: NavigateFunction;
  setProcessing: (val: boolean) => void;
}

export const userLogin = async ({
  data,
  form,
  messageApi,
  notificationApi,
  setProcessing,
  navigate,
}: LoginProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "userLogin", "Loading Login...");
    const response = await login(data);
    if (response?.status == 200) {
      const decoded = jwtDecode(response?.data?.accessToken);
      setItem({
        key: "profile",
        value: {
          token: response?.data?.accessToken,
          expire: decoded?.exp,
        },
      });

      processSuccessN(notificationApi, "userLogin", "Login Success", () => {
        form.resetFields();
        navigate("/admin/dashboard");
      });
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError?.response?.status == 400) {
      processErrorN(notificationApi, "userLogin", form, axiosError);
    } else {
      processFail(messageApi, "userLogin", "Login Failed");
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};

interface LogoutProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  navigate: NavigateFunction;
  setProcessing: (val: boolean) => void;
}

export const userLogout = async ({
  messageApi,
  notificationApi,
  setProcessing,
  navigate,
}: LogoutProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "userLogout", "Logging out...");
    const response = await logout();
    if (response?.status == 200) {
      processSuccessN(notificationApi, "userLogout", "Logout Success", () => {
        removeItem("profile");
        removeItem("collapsed");
        navigate("/auth/login");
      });
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError?.response?.status == 404) {
      processFail(messageApi, "userLogout", "User not found");
    } else {
      processFail(messageApi, "userLogout", "Logout Failed");
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
