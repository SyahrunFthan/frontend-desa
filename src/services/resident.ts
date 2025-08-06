import type { FormInstance, UploadFile } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import {
  processErrorN,
  processFail,
  processFinish,
  processStart,
  processSuccessN,
} from "../helpers/process";
import { createResident, deleteResident, updateResident } from "../apis";
import type { AxiosError } from "axios";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  formData: FormData;
  setFile: (file: UploadFile[] | null) => void;
  setProcessing: (val: boolean) => void;
  fetchResident: () => void;
}

export const residentCreated = async ({
  messageApi,
  notificationApi,
  form,
  setFile,
  setProcessing,
  formData,
  fetchResident,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "residentCreated", "Creating Resident");
    const response = await createResident(formData);
    if (response.status == 201) {
      processSuccessN(
        notificationApi,
        "residentCreated",
        response.data?.message || "Create Success",
        () => {
          form.resetFields();
          fetchResident();
          setFile(null);
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status == 400) {
      console.log(axiosError?.response?.data);

      processErrorN(notificationApi, "residentCreated", form, axiosError);
    } else if (axiosError.response?.status == 422) {
      processErrorN(notificationApi, "residentCreated", form, axiosError);
    } else {
      console.log(axiosError.response);

      processFail(
        messageApi,
        "residentCreated",
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
  setProcessing: (val: boolean) => void;
  fetchResident: () => void;
}

export const residentDeleted = async ({
  id,
  messageApi,
  notificationApi,
  setProcessing,
  fetchResident,
}: DeleteProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "residentDeleted", "Deleting Resident");
    const response = await deleteResident(id);
    if (response.status == 200) {
      processSuccessN(
        notificationApi,
        "residentDeleted",
        response.data.message || "Success",
        () => {
          fetchResident();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError?.response?.status == 404) {
      processFail(
        messageApi,
        "residentDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "residentDeleted",
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
  formData: FormData;
  id: string;
  setId: (id: string) => void;
  setOpenDrawer: (value: boolean) => void;
  setFile: (file: UploadFile[] | null) => void;
  setProcessing: (val: boolean) => void;
  fetchResident: () => void;
}

export const residentUpdated = async ({
  messageApi,
  notificationApi,
  form,
  setFile,
  setProcessing,
  formData,
  id,
  setId,
  setOpenDrawer,
  fetchResident,
}: UpdateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "residentUpdated", "Creating Resident");
    const response = await updateResident(id, formData);
    if (response.status == 200) {
      processSuccessN(
        notificationApi,
        "residentUpdated",
        response.data?.message || "Create Success",
        () => {
          form.resetFields();
          fetchResident();
          setFile(null);
          setId("");
          setOpenDrawer(false);
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status == 400) {
      console.log(axiosError?.response?.data);

      processErrorN(notificationApi, "residentUpdated", form, axiosError);
    } else if (axiosError.response?.status == 422) {
      processErrorN(notificationApi, "residentUpdated", form, axiosError);
    } else {
      console.log(axiosError.response);

      processFail(
        messageApi,
        "residentUpdated",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
