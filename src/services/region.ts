import type { FormInstance } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { RegionModel } from "../models/region";
import type { Dispatch, SetStateAction } from "react";
import {
  processErrorN,
  processFail,
  processFinish,
  processStart,
  processSuccessN,
} from "../helpers/process";
import { createRegion, deleteRegion, updateRegion } from "../apis";
import type { AxiosError } from "axios";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  data: Omit<RegionModel, "id" | "leader">;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const regionCreated = async ({
  data,
  fetchData,
  form,
  messageApi,
  notificationApi,
  setProcessing,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "regionCreated", "Creating Region");
    const response = await createRegion(data);
    if (response.status === 201) {
      processSuccessN(
        notificationApi,
        "regionCreated",
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
      processErrorN(notificationApi, "regionCreated", form, axiosError);
    } else {
      processFail(
        messageApi,
        "regionCreated",
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
  data: Omit<RegionModel, "leader">;
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const regionUpdated = async ({
  data,
  fetchData,
  form,
  id,
  messageApi,
  notificationApi,
  setId,
  setProcessing,
  setOpenDrawer,
}: UpdateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "regionUpdated", "Updating Region");
    const response = await updateRegion(id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "regionUpdated",
        response.data.message || "Success",
        () => {
          fetchData();
          setId("");
          form.resetFields();
          setOpenDrawer(false);
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "regionCreated", form, axiosError);
    } else if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "regionUpdated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "regionUpdated",
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

export const regionDeleted = async ({
  fetchData,
  id,
  messageApi,
  notificationApi,
  setProcessing,
}: DeleteProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "regionDeleted", "Deleting Region");
    const response = await deleteRegion(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "regionDeleted",
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
        "regionDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "regionDeleted",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
