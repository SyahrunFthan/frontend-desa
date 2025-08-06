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
import {
  createIncomingLetter,
  deleteIncomingLetter,
  updateIncomingLetter,
} from "../apis";
import type { AxiosError } from "axios";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  data: FormData;
  setProcessing: (value: boolean) => void;
  fetchData: () => void;
  setFile: (file: UploadFile[] | null) => void;
}

export const incomingLetterCreated = async ({
  messageApi,
  data,
  fetchData,
  form,
  notificationApi,
  setProcessing,
  setFile,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(
      messageApi,
      "incomingLetterCreated",
      "Creating Incoming Letter"
    );
    const response = await createIncomingLetter(data);
    if (response.status === 201) {
      processSuccessN(
        notificationApi,
        "incomingLetterCreated",
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
      processErrorN(notificationApi, "incomingLetterCreated", form, axiosError);
    } else if (axiosError.response?.status === 422) {
      processErrorN(notificationApi, "incomingLetterCreated", form, axiosError);
    } else {
      processFail(
        messageApi,
        "incomingLetterCreated",
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
  setId: (id: string) => void;
  setProcessing: (val: boolean) => void;
  fetchData: () => void;
  setOpenDrawer: (val: boolean) => void;
  setFile: (file: UploadFile[] | null) => void;
}

export const incomingLetterUpdated = async ({
  messageApi,
  data,
  fetchData,
  form,
  id,
  notificationApi,
  setFile,
  setId,
  setOpenDrawer,
  setProcessing,
}: UpdateProps) => {
  try {
    setProcessing(true);
    processStart(
      messageApi,
      "incomingLetterUpdated",
      "Updating Incoming Letter"
    );
    const response = await updateIncomingLetter(id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "incomingLetterUpdated",
        response.data.message || "Success",
        () => {
          fetchData();
          form.resetFields();
          setFile(null);
          setId("");
          setOpenDrawer(false);
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "incomingLetterUpdated", form, axiosError);
    } else if (axiosError.response?.status === 422) {
      processErrorN(notificationApi, "incomingLetterUpdated", form, axiosError);
    } else if (axiosError.response?.status == 404) {
      processFail(
        messageApi,
        "incomingLetterUpdated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "incomingLetterUpdated",
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
  id: string;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  setProcessing: (val: boolean) => void;
  fetchData: () => void;
}

export const incomingLetterDeleted = async ({
  id,
  messageApi,
  notificationApi,
  setProcessing,
  fetchData,
}: DeleteProps) => {
  try {
    setProcessing(true);
    processStart(
      messageApi,
      "incomingLetterDeleted",
      "Deleting Incoming Letter"
    );
    const response = await deleteIncomingLetter(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "incomingLetterDeleted",
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
        "incomingLetterUpdated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "incomingLetterUpdated",
        axiosError.response?.data?.message || "Not Found"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
