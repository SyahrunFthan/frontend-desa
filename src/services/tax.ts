import type { FormInstance } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { taxState, type TaxModel } from "../models/tax";
import type { Dispatch, SetStateAction } from "react";
import {
  processErrorN,
  processFail,
  processFinish,
  processStart,
  processSuccessN,
} from "../helpers/process";
import { createTax, deleteTax, updateTax } from "../apis";
import type { AxiosError } from "axios";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  data: Omit<TaxModel, "id">;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const taxCreated = async ({
  data,
  fetchData,
  form,
  messageApi,
  notificationApi,
  setProcessing,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "taxCreated", "Creating Tax");
    const response = await createTax(data);
    if (response.status === 201) {
      processSuccessN(
        notificationApi,
        "taxCreated",
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
      processErrorN(notificationApi, "taxCreated", form, axiosError);
    } else {
      processFail(
        messageApi,
        "taxCreated",
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
  data: Omit<TaxModel, "id">;
  id: string;
  setRecord: Dispatch<SetStateAction<TaxModel>>;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const taxUpdated = async ({
  data,
  fetchData,
  form,
  id,
  messageApi,
  notificationApi,
  setProcessing,
  setRecord,
  setOpenDrawer,
}: UpdateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "taxUpdated", "Updating Tax");
    const response = await updateTax(id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "taxUpdated",
        response.data.message || "Success",
        () => {
          fetchData();
          form.resetFields();
          setRecord(taxState);
          setOpenDrawer(false);
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "taxUpdated", form, axiosError);
    } else if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "taxUpdated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "taxUpdated",
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

export const taxDeleted = async ({
  fetchData,
  id,
  messageApi,
  notificationApi,
  setProcessing,
}: DeleteProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "taxDeleted", "Deleting Tax");
    const response = await deleteTax(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "taxDeleted",
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
        "taxDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "taxDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
