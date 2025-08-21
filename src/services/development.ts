import type { FormInstance } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { developmentState, type DevelopmentModel } from "../models/development";
import type { Dispatch, SetStateAction } from "react";
import { AxiosError } from "axios";
import {
  processErrorN,
  processFail,
  processFinish,
  processStart,
  processSuccessN,
} from "../helpers/process";
import {
  createDevelopment,
  deleteDevelopment,
  updateDevelopment,
} from "../apis";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  data: Omit<DevelopmentModel, "id">;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const developmentCreated = async ({
  data,
  fetchData,
  form,
  messageApi,
  notificationApi,
  setProcessing,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "developmentCreated", "Creating Development");
    const response = await createDevelopment(data);
    if (response.status === 201) {
      processSuccessN(
        notificationApi,
        "developmentCreated",
        response.data.message || "Success",
        () => {
          fetchData();
          form.resetFields();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "developmentCreated", form, axiosError);
    } else {
      processFail(
        messageApi,
        "developmentCreated",
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
  data: Omit<DevelopmentModel, "id">;
  id: string;
  setRecord: Dispatch<SetStateAction<DevelopmentModel>>;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const developmentUpdated = async ({
  data,
  fetchData,
  form,
  id,
  messageApi,
  notificationApi,
  setOpenDrawer,
  setProcessing,
  setRecord,
}: UpdateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "developmentUpdated", "Updating Development");
    const response = await updateDevelopment(id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "developmentUpdated",
        response.data.message || "Success",
        () => {
          fetchData();
          form.resetFields();
          setRecord(developmentState);
          setOpenDrawer(false);
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "developmentUpdated", form, axiosError);
    } else if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "developmentUpdated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "developmentUpdated",
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
  setProcessing: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const developmentDeleted = async ({
  fetchData,
  id,
  messageApi,
  notificationApi,
  setProcessing,
}: DeleteProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "developmentDeleted", "Deleting Development");
    const response = await deleteDevelopment(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "developmentDeleted",
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
        "developmentUpdated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "developmentUpdated",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
