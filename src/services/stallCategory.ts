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
import {
  createStallCategory,
  deleteStallCategory,
  updateStallCategory,
} from "../apis";
import type { AxiosError } from "axios";
import type { StallCategoryModel } from "../models/stallCategory";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  data: FormData;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  setFile: Dispatch<SetStateAction<UploadFile[] | null>>;
  fetchData: () => void;
}

export const stallCategoryCreated = async (params: CreateProps) => {
  const {
    data,
    fetchData,
    form,
    messageApi,
    notificationApi,
    setFile,
    setProcessing,
  } = params;

  try {
    setProcessing(true);
    processStart(messageApi, "stallCategoryCreated", "Creating Stall Category");
    const response = await createStallCategory(data);
    if (response.status === 201) {
      processSuccess(
        messageApi,
        "stallCategoryCreated",
        response.data.message || "Success",
        () => {
          form.resetFields();
          setFile(null);
          fetchData();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "stallCategoryCreated", form, axiosError);
    } else if (axiosError.response?.status === 422) {
      processErrorN(notificationApi, "stallCategoryCreated", form, axiosError);
    } else {
      processFail(
        messageApi,
        "stallCategoryCreated",
        axiosError.response?.data?.message || "Failed"
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
  setProcessing: Dispatch<SetStateAction<boolean>>;
  setFile: Dispatch<SetStateAction<UploadFile[] | null>>;
  setRecord: Dispatch<SetStateAction<StallCategoryModel | null>>;
  fetchData: () => void;
}

export const stallCategoryUpdated = async (params: UpdateProps) => {
  const {
    data,
    fetchData,
    form,
    id,
    messageApi,
    notificationApi,
    setFile,
    setProcessing,
    setRecord,
  } = params;

  try {
    setProcessing(true);
    processStart(messageApi, "stallCategoryUpdated", "Updating Stall Category");
    const response = await updateStallCategory(id, data);
    if (response.status === 200) {
      processSuccess(
        messageApi,
        "stallCategoryUpdated",
        response.data.message || "Success",
        () => {
          form.resetFields();
          setFile(null);
          setRecord(null);
          fetchData();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "stallCategoryUpdated", form, axiosError);
    } else if (axiosError.response?.status === 422) {
      processErrorN(notificationApi, "stallCategoryUpdated", form, axiosError);
    } else if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "stallCategoryUpdated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "stallCategoryUpdated",
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
  setProcessing: Dispatch<SetStateAction<boolean>>;
  id: string;
  fetchData: () => void;
}

export const stallCategoryDeleted = async (params: DeleteProps) => {
  const { fetchData, id, messageApi, notificationApi, setProcessing } = params;

  try {
    setProcessing(true);
    processStart(messageApi, "stallCategoryDeleted", "Deleting Stall Category");
    const response = await deleteStallCategory(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "stallCategoryDeleted",
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
        "stallCategoryDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "stallCategoryDeleted",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
