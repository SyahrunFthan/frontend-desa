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
  createOutgoingLetter,
  deleteOutgoingLetter,
  updateOutgoingLetter,
} from "../apis";
import type { AxiosError } from "axios";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  data: FormData;
  setProcessing: (processing: boolean) => void;
  fetchData: () => void;
  setFile: (file: UploadFile[] | null) => void;
}

export const outgoingLetterCreated = async ({
  data,
  fetchData,
  form,
  messageApi,
  notificationApi,
  setFile,
  setProcessing,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(
      messageApi,
      "outgoingLetterCreated",
      "Creating Outgoing Letter"
    );
    const response = await createOutgoingLetter(data);
    if (response.status === 201) {
      processSuccessN(
        notificationApi,
        "outgoingLetterCreated",
        response.data.message || "Success",
        () => {
          fetchData();
          setFile(null);
          form.resetFields();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "outgoingLetterCreated", form, axiosError);
    } else if (axiosError.response?.status === 422) {
      processErrorN(notificationApi, "outgoingLetterCreated", form, axiosError);
    } else {
      processFail(
        messageApi,
        "outgoingLetterCreated",
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
  setProcessing: (processing: boolean) => void;
  fetchData: () => void;
  setFile: (file: UploadFile[] | null) => void;
  setId: (id: string) => void;
  setOpenDrawer: (open: boolean) => void;
}

export const outgoingLetterUpdated = async ({
  data,
  fetchData,
  form,
  id,
  messageApi,
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
      "outgoingLetterUpdated",
      "Updating Outgoing Letter"
    );
    const response = await updateOutgoingLetter(id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "outgoingLetterUpdated",
        response.data.message || "Success",
        () => {
          setId("");
          setFile(null);
          setOpenDrawer(false);
          fetchData();
          form.resetFields();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "outgoingLetterCreated", form, axiosError);
    } else if (axiosError.response?.status === 422) {
      processErrorN(notificationApi, "outgoingLetterCreated", form, axiosError);
    } else if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "outgoingLetterCreated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "outgoingLetterCreated",
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
  setProcessing: (processing: boolean) => void;
  fetchData: () => void;
}

export const outgoingLetterDeleted = async ({
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
      "outgoingLetterDeleted",
      "Deleting Outgoing Letter"
    );
    const response = await deleteOutgoingLetter(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "outgoingLetterDeleted",
        response.data.message,
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
        "outgoingLetterDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "outgoingLetterDeleted",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
