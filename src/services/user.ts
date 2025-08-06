import type { FormInstance } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { UserForm, UserUpdateForm } from "../models/user";
import {
  processErrorN,
  processFail,
  processFinish,
  processStart,
  processSuccessN,
} from "../helpers/process";
import { createUser, deleteUser, updateUser } from "../apis";
import type { AxiosError } from "axios";

interface CreateProps {
  form: FormInstance;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  data: Omit<UserForm, "id">;
  setProcessing: (value: React.SetStateAction<boolean>) => void;
  fetchData: () => void;
}

export const userCreated = async ({
  form,
  messageApi,
  notificationApi,
  setProcessing,
  data,
  fetchData,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "userCreated", "User Created");
    const response = await createUser(data);
    if (response?.status == 201) {
      processSuccessN(
        notificationApi,
        "roleCreated",
        response?.data?.message || "success",
        () => {
          form.resetFields();
          fetchData();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError?.response?.status == 400) {
      processErrorN(notificationApi, "roleCreated", form, axiosError);
    } else {
      console.log(axiosError?.response);
      processFail(
        messageApi,
        "fetchRole",
        axiosError?.response?.data?.message || "Error server."
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};

interface DeleteProps {
  id: string;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  setProcessing: (value: React.SetStateAction<boolean>) => void;
  fetchData: () => void;
}

export const userDeleted = async ({
  id,
  messageApi,
  notificationApi,
  setProcessing,
  fetchData,
}: DeleteProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "userDeleted", "User Deleted");
    const response = await deleteUser(id);
    if (response?.status == 200) {
      processSuccessN(
        notificationApi,
        "userDeleted",
        response?.data?.message || "success",
        () => {
          fetchData();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError?.response?.status == 404) {
      processFail(
        messageApi,
        "userDeleted",
        axiosError?.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "userDeleted",
        axiosError?.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};

interface UpdateProps {
  form: FormInstance;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  data: UserUpdateForm;
  id: string;
  setId: (value: string) => void;
  setProcessing: (value: React.SetStateAction<boolean>) => void;
  setIsOpen: (value: boolean) => void;
  fetchData: () => void;
}
export const userUpdated = async ({
  form,
  messageApi,
  notificationApi,
  setProcessing,
  data,
  id,
  setId,
  setIsOpen,
  fetchData,
}: UpdateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "userUpdated", "Editing User");
    const response = await updateUser(id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "userUpdated",
        response?.data?.message || "success",
        () => {
          form.resetFields();
          setId("");
          setIsOpen(false);
          fetchData();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError?.response?.status == 400) {
      processErrorN(notificationApi, "roleCreated", form, axiosError);
    } else if (axiosError?.response?.status == 404) {
      processErrorN(notificationApi, "roleCreated", form, axiosError);
    } else {
      processFail(
        messageApi,
        "fetchRole",
        axiosError?.response?.data?.message || "Error server."
      );
      console.log(axiosError?.response);
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
