import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { Dispatch, SetStateAction } from "react";
import {
  processFail,
  processFinish,
  processStart,
  processSuccessN,
} from "../helpers/process";
import { deleteCommentNews } from "../apis";
import type { AxiosError } from "axios";

interface DeleteProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  id: string;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const commentNewsDeleted = async (params: DeleteProps) => {
  const { fetchData, id, messageApi, notificationApi, setProcessing } = params;

  try {
    setProcessing(true);
    processStart(messageApi, "commentNewsDeleted", "Deleting Comment News");
    const response = await deleteCommentNews(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "commentNewsDeleted",
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
        "commentNewsDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "commentNewsDeleted",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
