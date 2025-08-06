import type { FormInstance } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import {
  processErrorN,
  processFail,
  processFinish,
  processStart,
  processSuccessN,
} from "../helpers/process";
import { createEmployee, deleteEmployee, updateEmployee } from "../apis";
import type { AxiosError } from "axios";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  data: FormData;
  setProcessing: (value: boolean) => void;
  fetchData: () => void;
}

export const employeeCreated = async ({
  data,
  form,
  messageApi,
  notificationApi,
  setProcessing,
  fetchData,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "employeeCreated", "Creating Employee...");
    const response = await createEmployee(data);
    if (response.status == 201) {
      processSuccessN(
        notificationApi,
        "employeeCreated",
        response.data.message || "Success",
        () => {
          form.resetFields();
          fetchData();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status == 400) {
      processErrorN(notificationApi, "employeeCreated", form, axiosError);
    } else if (axiosError.response?.status == 422) {
      processErrorN(notificationApi, "employeeCreated", form, axiosError);
    } else {
      processFail(
        messageApi,
        "employeeCreated",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};

interface UpdateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  data: FormData;
  id: string;
  setId: (id: string) => void;
  setOpenDrawer: (open: boolean) => void;
  setProcessing: (val: boolean) => void;
  fetchData: () => void;
}

export const employeeUpdated = async ({
  data,
  form,
  id,
  messageApi,
  notificationApi,
  setId,
  setOpenDrawer,
  setProcessing,
  fetchData,
}: UpdateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "employeeUpdated", "Updating Employee");
    const response = await updateEmployee(id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "employeeUpdated",
        response.data.message || "Success",
        () => {
          setId("");
          setOpenDrawer(false);
          fetchData();
          form.resetFields();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "employeeUpdated", form, axiosError);
    } else if (axiosError.response?.status === 422) {
      processErrorN(notificationApi, "employeeUpdated", form, axiosError);
    } else if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "employeeUpdated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "employeeUpdated",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};

interface DeleteProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  id: string;
  setProcessing: (val: boolean) => void;
  fetchData: () => void;
}

export const employeeDeleted = async ({
  messageApi,
  notificationApi,
  fetchData,
  id,
  setProcessing,
}: DeleteProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "employeeDeleted", "Deleting Employee...");
    const response = await deleteEmployee(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "employeeDeleted",
        response.data.message || "Success",
        () => {
          fetchData();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "employeeDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "employeeDeleted",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
