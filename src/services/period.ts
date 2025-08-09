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
import {
  createPeriod,
  deletePeriod,
  updatePeriod,
  uploadPeriod,
} from "../apis";
import type { AxiosError } from "axios";
import type { PeriodModel } from "../models/period";
import type { UploadFile } from "antd/lib";
import type { Dispatch, SetStateAction } from "react";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  data: Omit<PeriodModel, "id">;
  form: FormInstance;
  setProcessing: (val: boolean) => void;
  fetchData: () => void;
}

export const periodCreated = async ({
  data,
  fetchData,
  form,
  messageApi,
  notificationApi,
  setProcessing,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "periodCreated", "Creating Period");
    const response = await createPeriod(data);
    if (response.status === 201) {
      processSuccessN(
        notificationApi,
        "periodCreated",
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
      processErrorN(notificationApi, "periodCreated", form, axiosError);
    } else if (axiosError.response?.status === 422) {
      processErrorN(notificationApi, "periodCreated", form, axiosError);
    } else {
      processFail(
        messageApi,
        "periodCreated",
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
  data: PeriodModel;
  form: FormInstance;
  setProcessing: (val: boolean) => void;
  fetchData: () => void;
  id: string;
  setId: (id: string) => void;
}

export const periodUpdated = async ({
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
    processStart(messageApi, "periodUpdated", "Updating Period");
    const response = await updatePeriod(id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "periodUpdated",
        response.data.message || "Success",
        () => {
          fetchData();
          setId("");
          form.resetFields();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "periodUpdated", form, axiosError);
    } else if (axiosError.response?.status === 422) {
      processErrorN(notificationApi, "periodUpdated", form, axiosError);
    } else if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "periodUpdated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "periodUpdated",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};

interface DeletePerops {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  id: string;
  setProcessing: (val: boolean) => void;
  fetchData: () => void;
}

export const periodDeleted = async ({
  messageApi,
  notificationApi,
  fetchData,
  id,
  setProcessing,
}: DeletePerops) => {
  try {
    setProcessing(true);
    processStart(messageApi, "periodDeleter", "Deleting Period");
    const response = await deletePeriod(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "periodDeleted",
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
        "periodDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "periodDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};

interface UploadProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  id: string;
  data: FormData;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setFile: (file: UploadFile[]) => void;
  fetchData: () => void;
}

export const periodUploaded = async ({
  data,
  fetchData,
  id,
  messageApi,
  notificationApi,
  setFile,
  setLoading,
}: UploadProps) => {
  try {
    setLoading(false);
    processStart(messageApi, "periodUploaded", "Uploading File");
    const response = await uploadPeriod(id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "periodUploaded",
        response.data.message || "Success",
        () => {
          setFile([]);
          fetchData();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 422) {
      processFail(
        messageApi,
        "periodUploaded",
        axiosError.response?.data?.message || "Upload Filed"
      );
    } else if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "periodUploaded",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "periodUploaded",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setLoading(false);
    });
  }
};
