import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { SubmissionServiceModel } from "../models/submissionService";
import type { FormInstance } from "antd";
import type { Dispatch, SetStateAction } from "react";
import {
  processErrorN,
  processFail,
  processFailN,
  processFinish,
  processStart,
  processSuccess,
} from "../helpers/process";
import {
  deleteSubmissionService,
  updateStatusSubmissionService,
} from "../apis";
import type { AxiosError } from "axios";

interface UpdateStatusProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  data: Pick<SubmissionServiceModel, "code" | "status_submission" | "note">;
  form: FormInstance;
  id: string;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const submissionServiceUpdateStatus = async (
  params: UpdateStatusProps
) => {
  const {
    data,
    fetchData,
    form,
    messageApi,
    notificationApi,
    setProcessing,
    id,
  } = params;

  try {
    setProcessing(true);
    processStart(
      messageApi,
      "submissionServiceUpdateStatus",
      "Updating Status"
    );
    const response = await updateStatusSubmissionService(id, data);
    if (response.status === 200) {
      processSuccess(
        messageApi,
        "submissionServiceUpdateStatus",
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
      processErrorN(
        notificationApi,
        "submissionServiceUpdateStatus",
        form,
        axiosError
      );
      console.log(axiosError.response);
    } else if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "submissionServiceUpdateStatus",
        axiosError.response?.data?.message || "Not Found",
        () => {
          form.resetFields();
        }
      );
    } else {
      processFail(
        messageApi,
        "submissionServiceUpdateStatus",
        axiosError.response?.data?.message || "Server Error",
        () => {
          form.resetFields();
        }
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

export const submissionServiceDeleted = async (params: DeleteProps) => {
  const { fetchData, id, messageApi, notificationApi, setProcessing } = params;

  try {
    setProcessing(true);
    processStart(
      messageApi,
      "submissionServiceDeleted",
      "Deleting Submission Service"
    );
    const response = await deleteSubmissionService(id);
    if (response.status === 200) {
      processSuccess(
        messageApi,
        "submissionServiceDeleted",
        response.data.message || "Success",
        () => {
          fetchData();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 404) {
      processFailN(
        notificationApi,
        "submissionServiceDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFailN(
        notificationApi,
        "submissionServiceDeleted",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
