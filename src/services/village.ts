import type { FormInstance, UploadFile } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { Dispatch, SetStateAction } from "react";
import {
  processFail,
  processFailN,
  processFinish,
  processStart,
  processSuccessN,
} from "../helpers/process";
import { updateAbout, updateImage, updateLogo, updateVission } from "../apis";
import type { AxiosError } from "axios";
import type { VillageModel } from "../models/village";

interface UpdateLogoProps {
  id: string;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  data: FormData;
  setFile: Dispatch<SetStateAction<UploadFile[]>>;
  setProcessing: Dispatch<SetStateAction<boolean>>;
}

export const villageLogoUpdated = async ({
  data,
  id,
  messageApi,
  notificationApi,
  setFile,
  setProcessing,
}: UpdateLogoProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "villageLogoUpdated", "Updating Logo");
    const response = await updateLogo(id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "villageLogoUpdated",
        response.data.message || "Success",
        () => {
          setFile([]);
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 404) {
      processFailN(
        notificationApi,
        "villageLogoUpdated",
        axiosError.response?.data.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "villageLogoUpdated",
        axiosError.response?.data.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};

interface UpdateImageProps {
  id: string;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  data: FormData;
  setFile: Dispatch<SetStateAction<UploadFile[]>>;
  setProcessing: Dispatch<SetStateAction<boolean>>;
}

export const villageImageUpdated = async ({
  data,
  id,
  messageApi,
  notificationApi,
  setFile,
  setProcessing,
}: UpdateImageProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "villageImageUpdated", "Updating Image");
    const response = await updateImage(id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "villageImageUpdated",
        response.data.message || "Success",
        () => {
          setFile([]);
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 404) {
      processFailN(
        notificationApi,
        "villageImageUpdated",
        axiosError.response?.data.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "villageImageUpdated",
        axiosError.response?.data.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};

interface UpdateVissionProps {
  id: string;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  data: Pick<VillageModel, "vission" | "mission">;
  setProcessing: Dispatch<SetStateAction<boolean>>;
}

export const villageVissionUpdated = async ({
  data,
  id,
  messageApi,
  notificationApi,
  setProcessing,
}: UpdateVissionProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "villageVissionUpdated", "Updating Image");
    const response = await updateVission(id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "villageVissionUpdated",
        response.data.message || "Success",
        () => null
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 404) {
      processFailN(
        notificationApi,
        "villageVissionUpdated",
        axiosError.response?.data.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "villageVissionUpdated",
        axiosError.response?.data.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
interface UpdateAboutProps {
  id: string;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  data: Pick<VillageModel, "about" | "history" | "name">;
  setProcessing: Dispatch<SetStateAction<boolean>>;
}

export const villageAboutUpdated = async ({
  data,
  id,
  messageApi,
  notificationApi,
  setProcessing,
}: UpdateAboutProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "villageAboutUpdated", "Updating Image");
    const response = await updateAbout(id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "villageAboutUpdated",
        response.data.message || "Success",
        () => null
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 404) {
      processFailN(
        notificationApi,
        "villageAboutUpdated",
        axiosError.response?.data.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "villageAboutUpdated",
        axiosError.response?.data.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
