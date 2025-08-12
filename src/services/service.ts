import type { FormInstance, UploadFile } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { Dispatch, SetStateAction } from "react";
import {
  processErrorN,
  processFail,
  processFinish,
  processStart,
  processSuccessN,
} from "../helpers/process";
import { createService, deleteService, updateService } from "../apis";
import type { AxiosError } from "axios";
import type { ServiceModel } from "../models/service";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  data: FormData;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  setFile: Dispatch<SetStateAction<UploadFile[] | null>>;
  fetchData: () => void;
}

export const serviceCreated = async ({
  data,
  fetchData,
  form,
  messageApi,
  notificationApi,
  setProcessing,
  setFile,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "serviceCreated", "Creating Service");
    const response = await createService(data);
    if (response.status === 201) {
      processSuccessN(
        notificationApi,
        "serviceCreated",
        response.data.message || "Success",
        () => {
          fetchData();
          form.resetFields();
          setFile(null);
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "serviceCreated", form, axiosError);
    } else if (axiosError.response?.status === 422) {
      processErrorN(notificationApi, "serviceCreated", form, axiosError);
    } else {
      processFail(
        messageApi,
        "serviceCreated",
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
  setId: Dispatch<SetStateAction<string>>;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  setFile: Dispatch<SetStateAction<UploadFile[] | null>>;
  setRecord: Dispatch<SetStateAction<ServiceModel>>;
  fetchData: () => void;
}

export const serviceUpdated = async ({
  data,
  fetchData,
  form,
  id,
  messageApi,
  notificationApi,
  setId,
  setOpenDrawer,
  setProcessing,
  setFile,
  setRecord,
}: UpdateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "serviceUpdated", "Updating Service");
    const response = await updateService(id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "serviceUpdated",
        response.data.message || "Success",
        () => {
          fetchData();
          form.resetFields();
          setId("");
          setOpenDrawer(false);
          setFile(null);
          setRecord({
            id: "",
            name: "",
            status_service: "",
            template_file: "",
            template_path: "",
            type_service: "",
          });
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "serviceUpdated", form, axiosError);
    } else if (axiosError.response?.status === 422) {
      processErrorN(notificationApi, "serviceUpdated", form, axiosError);
    } else if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "serviceUpdated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "serviceUpdated",
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

export const serviceDeleted = async ({
  fetchData,
  id,
  messageApi,
  notificationApi,
  setProcessing,
}: DeleteProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "serviceDeleted", "Deleting Service");
    const response = await deleteService(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "serviceDeleted",
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
        "serviceDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "serviceDeleted",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
