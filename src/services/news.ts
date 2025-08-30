import type { FormInstance, UploadFile } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { Dispatch, SetStateAction } from "react";
import {
  processErrorN,
  processFail,
  processFinish,
  processStart,
  processSuccess,
  processSuccessN,
} from "../helpers/process";
import { createNews, deleteNews, updateNews } from "../apis";
import type { AxiosError } from "axios";
import type { NewsModel } from "../models/news";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  data: FormData;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  setFile: Dispatch<SetStateAction<UploadFile[]>>;
  setContent: Dispatch<SetStateAction<string>>;
  fetchData: () => void;
}

export const newsCreated = async ({
  messageApi,
  notificationApi,
  form,
  data,
  setProcessing,
  setFile,
  fetchData,
  setContent,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "newsCreated", "Creating News");
    const response = await createNews(data);
    if (response.status === 201) {
      processSuccessN(
        notificationApi,
        "newsCreated",
        response.data.message || "Success",
        () => {
          form.resetFields();
          setProcessing(false);
          setFile([]);
          fetchData();
          setContent("");
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "newsCreated", form, axiosError);
    } else if (axiosError.response?.status === 422) {
      processErrorN(notificationApi, "newsCreated", form, axiosError);
    } else {
      processFail(
        messageApi,
        "newsCreated",
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
  setRecord: Dispatch<SetStateAction<NewsModel | null>>;
  setFile: Dispatch<SetStateAction<UploadFile[]>>;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  setContent: Dispatch<SetStateAction<string>>;
  fetchData: () => void;
}

export const newsUpdated = async ({
  data,
  fetchData,
  form,
  id,
  messageApi,
  notificationApi,
  setFile,
  setProcessing,
  setRecord,
  setOpenDrawer,
  setContent,
}: UpdateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "newsUpdated", "Updating News");
    const response = await updateNews(id, data);
    if (response.status === 200) {
      processSuccess(
        messageApi,
        "newsUpdated",
        response.data.message || "Success",
        () => {
          form.resetFields();
          setProcessing(false);
          setFile([]);
          setRecord(null);
          setOpenDrawer(false);
          fetchData();
          setContent("");
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "newsUpdated", form, axiosError);
    } else if (axiosError.response?.status === 422) {
      processErrorN(notificationApi, "newsUpdated", form, axiosError);
    } else if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "newsUpdated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "newsUpdated",
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

export const newsDeleted = async ({
  id,
  fetchData,
  messageApi,
  notificationApi,
  setProcessing,
}: DeleteProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "newsDeleted", "Deleting News");
    const response = await deleteNews(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "newsDeleted",
        response.data.message || "Success",
        () => {
          setProcessing(false);
          fetchData();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "newsDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "newsDeleted",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
