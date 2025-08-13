import type { FormInstance } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import {
  socialAssistanceState,
  type SocialAssistanceModel,
} from "../models/socialAssistance";
import type { Dispatch, SetStateAction } from "react";
import {
  processErrorN,
  processFail,
  processFinish,
  processStart,
  processSuccessN,
} from "../helpers/process";
import {
  createSocialAssistance,
  deleteSocialAssistance,
  updateSocialAssistance,
} from "../apis";
import type { AxiosError } from "axios";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  data: Omit<SocialAssistanceModel, "id">;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const socialAssistanceCreated = async ({
  data,
  fetchData,
  form,
  messageApi,
  notificationApi,
  setProcessing,
  setOpenDrawer,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(
      messageApi,
      "socialAssistanceCreated",
      "Creating Social Assistance"
    );
    const response = await createSocialAssistance(data);
    if (response.status === 201) {
      processSuccessN(
        notificationApi,
        "socialAssistanceCreated",
        response.data.message || "Success",
        () => {
          fetchData();
          form.resetFields();
          setOpenDrawer(false);
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(
        notificationApi,
        "socialAssistanceCreated",
        form,
        axiosError
      );
    } else {
      processFail(
        messageApi,
        "socialAssistanceCreated",
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
  data: Omit<SocialAssistanceModel, "id">;
  record: SocialAssistanceModel;
  setRecord: Dispatch<SetStateAction<SocialAssistanceModel>>;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const socialAssistanceUpdated = async ({
  data,
  fetchData,
  form,
  messageApi,
  notificationApi,
  record,
  setProcessing,
  setRecord,
  setOpenDrawer,
}: UpdateProps) => {
  try {
    setProcessing(false);
    processStart(
      messageApi,
      "socialAssistanceUpdated",
      "Updating Social Assistance"
    );
    const response = await updateSocialAssistance(record.id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "socialAssistanceUpdated",
        response.data.message || "Success",
        () => {
          form.resetFields();
          setOpenDrawer(false);
          setRecord(socialAssistanceState);
          fetchData();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(
        notificationApi,
        "socialAssistanceUpdated",
        form,
        axiosError
      );
    } else if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "socialAssistanceUpdated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "socialAssistanceUpdated",
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

export const socialAssistanceDeleted = async ({
  fetchData,
  id,
  messageApi,
  notificationApi,
  setProcessing,
}: DeleteProps) => {
  try {
    setProcessing(true);
    processStart(
      messageApi,
      "socialAssistanceDeleted",
      "Deleting Social Assistance"
    );
    const response = await deleteSocialAssistance(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "socialAssistanceDeleted",
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
        "socialAssistanceDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "socialAssistanceDeleted",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
