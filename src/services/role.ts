import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import {
  processErrorN,
  processFail,
  processFinish,
  processStart,
  processSuccessN,
} from "../helpers/process";
import { createRole, deleteRole, updateRole } from "../apis";
import type { AxiosError } from "axios";
import type { FormInstance } from "antd";
import type { RoleForm } from "../models/role";

interface DeleteProps {
  setProcessing: (value: boolean) => void;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  id: string;
  fetchData: () => void;
}

export const roleDeleted = async ({
  setProcessing,
  messageApi,
  notificationApi,
  id,
  fetchData,
}: DeleteProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "roleDeleted", "Loading Delete Data");
    const response = await deleteRole(id);
    if (response?.status == 200) {
      processSuccessN(
        notificationApi,
        "roleDeleted",
        response?.data?.message || "success",
        () => {
          setProcessing(false);
          fetchData();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError?.response?.status == 404) {
      processErrorN(notificationApi, "roleDeleted", undefined, axiosError);
      setProcessing(false);
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

interface CreateProps {
  form: FormInstance;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  setProcessing: (value: React.SetStateAction<boolean>) => void;
  data: Omit<RoleForm, "id">;
  fetchData: () => void;
}

export const roleCreated = async ({
  form,
  messageApi,
  notificationApi,
  setProcessing,
  data,
  fetchData,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "roleCreated", "Loading Create Data");
    const formData = {
      name: data.name || "",
      key: data.key || "",
    };
    const response = await createRole(formData);
    if (response?.status == 201) {
      processSuccessN(
        notificationApi,
        "roleCreated",
        response?.data?.message || "success",
        () => {
          setProcessing(false);
          fetchData();
          form.resetFields();
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

interface UpdateProps {
  form: FormInstance;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  setId: (id: string) => void;
  setProcessing: (value: boolean) => void;
  fetchData: () => void;
  data: RoleForm;
  id: string;
}

export const roleUpdated = async ({
  data,
  form,
  id,
  messageApi,
  notificationApi,
  setId,
  setProcessing,
  fetchData,
}: UpdateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "roleUpdated", "Update Role");
    const formData = {
      name: data.name || "",
      key: data.key || "",
      id: id || "",
    };
    const response = await updateRole(id, formData);
    if (response?.status == 200) {
      processSuccessN(
        notificationApi,
        "roleCreated",
        response?.data?.message || "success",
        () => {
          setProcessing(false);
          fetchData();
          form.resetFields();
          setId("");
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
