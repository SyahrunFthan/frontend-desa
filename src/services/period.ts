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
import { createPeriod, deletePeriod, updatePeriod } from "../apis";
import type { AxiosError } from "axios";
import type { PeriodModel } from "../models/period";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  data: FormData;
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
  data: FormData;
  form: FormInstance;
  setProcessing: (val: boolean) => void;
  fetchData: () => void;
  id: string;
  setId: (id: string) => void;
  setEditingRecord: (record: PeriodModel | undefined) => void;
}

export const periodUpdated = async ({
  data,
  fetchData,
  form,
  id,
  messageApi,
  notificationApi,
  setId,
  setEditingRecord,
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
          setEditingRecord(undefined);
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
