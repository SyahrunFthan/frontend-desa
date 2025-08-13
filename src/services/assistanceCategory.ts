import type { FormInstance } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { AssistanceCategoryModel } from "../models/assistanceCategory";
import type { Dispatch, SetStateAction } from "react";
import type { AxiosError } from "axios";
import {
  processErrorN,
  processFail,
  processFinish,
  processStart,
  processSuccessN,
} from "../helpers/process";
import {
  createAssistanceCategory,
  deleteAssistanceCategory,
  updateAssistanceCategory,
} from "../apis";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  data: Omit<AssistanceCategoryModel, "id">;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const assistanceCategoryCreated = async ({
  data,
  fetchData,
  form,
  messageApi,
  notificationApi,
  setProcessing,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "assistanceCategoryCreated", "Creating Category");
    const response = await createAssistanceCategory(data);
    if (response.status === 201) {
      processSuccessN(
        notificationApi,
        "assistanceCategoryCreated",
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
      processErrorN(
        notificationApi,
        "assistanceCategoryCreated",
        form,
        axiosError
      );
    } else {
      processFail(
        messageApi,
        "assistanceCategoryCreated",
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
  data: AssistanceCategoryModel;
  id: string;
  setRecord: Dispatch<SetStateAction<AssistanceCategoryModel>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const assistanceCategoryUpdated = async ({
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
    processStart(messageApi, "assistanceCategoryUpdated", "Updating Category");
    const response = await updateAssistanceCategory(id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "assistanceCategoryUpdated",
        response.data.message || "Success",
        () => {
          setOpenDrawer(false);
          fetchData();
          form.resetFields();
          setRecord({
            amount: 0,
            description: "",
            id: "",
            name: "",
            status: "",
            type_assistance: "",
            year: 2020,
          });
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(
        notificationApi,
        "assistanceCategoryUpdated",
        form,
        axiosError
      );
    } else if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "assistanceCategoryUpdated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      console.log(axiosError.response);

      processFail(
        messageApi,
        "assistanceCategoryUpdated",
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

export const assistanceCategoryDeleted = async ({
  fetchData,
  id,
  messageApi,
  notificationApi,
  setProcessing,
}: DeleteProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "assistanceCategoryDeleted", "Deleting Category");
    const response = await deleteAssistanceCategory(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "assistanceCategoryDeleted",
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
        "assistanceCategoryDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "assistanceCategoryDeleted",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
