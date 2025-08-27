import type { FormInstance, UploadFile } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { facilityState, type FacilityModel } from "../models/facility";
import type { Dispatch, SetStateAction } from "react";
import {
  processErrorN,
  processFail,
  processFinish,
  processStart,
  processSuccess,
  processSuccessN,
} from "../helpers/process";
import { createFacility, deleteFacility, updateFacility } from "../apis";
import type { AxiosError } from "axios";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  data: FormData;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  setFile: Dispatch<SetStateAction<UploadFile[] | null>>;
  fetchData: () => void;
}

export const facilityCreated = async ({
  data,
  fetchData,
  form,
  messageApi,
  notificationApi,
  setOpenDrawer,
  setProcessing,
  setFile,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "facilityCreated", "Creating Facility");
    const response = await createFacility(data);
    if (response.status === 201) {
      processSuccess(
        messageApi,
        "facilityCreated",
        response.data.message || "Success",
        () => {
          form.resetFields();
          fetchData();
          setOpenDrawer(false);
          setFile(null);
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "facilityCreated", form, axiosError);
    } else if (axiosError.response?.status === 422) {
      processErrorN(notificationApi, "facilityCreated", form, axiosError);
    } else {
      processFail(
        messageApi,
        "facilityCreated",
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
  setRecord: Dispatch<SetStateAction<FacilityModel>>;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  setFile: Dispatch<SetStateAction<UploadFile[] | null>>;
  fetchData: () => void;
}

export const facilityUpdated = async ({
  data,
  fetchData,
  form,
  id,
  messageApi,
  notificationApi,
  setOpenDrawer,
  setProcessing,
  setRecord,
  setFile,
}: UpdateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "facilityUpdated", "Updating Facility");
    const response = await updateFacility(id, data);
    if (response.status === 200) {
      processSuccess(
        messageApi,
        "facilityUpdated",
        response.data.message || "Success",
        () => {
          form.resetFields();
          fetchData();
          setRecord(facilityState);
          setOpenDrawer(false);
          setFile(null);
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "facilityUpdated", form, axiosError);
    } else if (axiosError.response?.status === 422) {
      processErrorN(notificationApi, "facilityUpdated", form, axiosError);
    } else if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "facilityUpdated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "facilityUpdated",
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

export const facilityDeleted = async ({
  fetchData,
  id,
  messageApi,
  notificationApi,
  setProcessing,
}: DeleteProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "facilityDeleted", "Deleting Facility");
    const response = await deleteFacility(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "facilityDeleted",
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
        "facilityDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      console.log(axiosError.response);

      processFail(
        messageApi,
        "facilityDeleted",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
