import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { Dispatch, SetStateAction } from "react";
import {
  processFail,
  processFinish,
  processStart,
  processSuccessN,
} from "../helpers/process";
import { deleteStall } from "../apis";
import type { AxiosError } from "axios";

interface DeleteProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  id: string;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const stallDeleted = async (params: DeleteProps) => {
  const { fetchData, id, messageApi, notificationApi, setProcessing } = params;

  try {
    setProcessing(true);
    processStart(messageApi, "stallDeleted", "Deleting Stall");
    const response = await deleteStall(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "stallDeleted",
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
        "stallDeleted",
        axiosError.response?.data?.message
      );
    } else {
      processFail(
        messageApi,
        "stallDeleted",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
