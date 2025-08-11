import type { FormInstance } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { RTUnitModel } from "../models/rtUnit";
import type { Dispatch, SetStateAction } from "react";
import {
  processErrorN,
  processFail,
  processFinish,
  processStart,
  processSuccessN,
} from "../helpers/process";
import { createRTUnit, deleteRTUnit, updateRTUnit } from "../apis";
import type { AxiosError } from "axios";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  data: Omit<RTUnitModel, "id">;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const rtUnitCreated = async ({
  data,
  fetchData,
  form,
  messageApi,
  notificationApi,
  setProcessing,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "rtUnitCreated", "Creating Rt Unit");
    const response = await createRTUnit(data);
    if (response.status === 201) {
      processSuccessN(
        notificationApi,
        "rtUnitCreated",
        response.data.message || "Success",
        () => {
          form.resetFields();
          fetchData();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "rtUnitCreated", form, axiosError);
    } else {
      processFail(
        messageApi,
        "rtUnitCreated",
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
  data: RTUnitModel;
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const rtUnitUpdated = async ({
  data,
  fetchData,
  form,
  id,
  messageApi,
  notificationApi,
  setId,
  setProcessing,
}: UpdateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "rtUnitUpdated", "Updating Rt Unit");
    const response = await updateRTUnit(id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "rtUnitUpdated",
        response.data.message || "Success",
        () => {
          setId("");
          fetchData();
          form.resetFields();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "rtUnitCreated", form, axiosError);
    } else if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "rtUnitUpdated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "rtUnitUpdated",
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

export const rtUnitDeleted = async ({
  fetchData,
  id,
  messageApi,
  notificationApi,
  setProcessing,
}: DeleteProps) => {
  try {
    setProcessing(false);
    processStart(messageApi, "rtUnitDeleted", "Deleting Rt Unit");
    const response = await deleteRTUnit(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "rtUnitDeleted",
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
        "rtUnitDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "rtUnitDeleted",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
