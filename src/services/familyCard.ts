import type { FormInstance } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { FamilyCardModel } from "../models/familyCard";
import {
  processErrorN,
  processFail,
  processFinish,
  processStart,
  processSuccessN,
} from "../helpers/process";
import { createFamilyCard, deleteFamilyCard, updateFamilyCard } from "../apis";
import type { AxiosError } from "axios";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  data: Omit<FamilyCardModel, "id">;
  setProcessing: (val: boolean) => void;
  fetchFamilyCard: () => void;
}

export const familyCardCreated = async ({
  messageApi,
  notificationApi,
  data,
  form,
  setProcessing,
  fetchFamilyCard,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "familyCardCreated", "Family Card Creating");
    const response = await createFamilyCard(data);
    if (response?.status == 201) {
      processSuccessN(
        notificationApi,
        "familyCardCreated",
        response.data?.message || "Create Success",
        () => {
          form.resetFields();
          fetchFamilyCard();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError?.response?.status == 400) {
      processErrorN(notificationApi, "familyCardCreated", form, axiosError);
    } else {
      processFail(
        messageApi,
        "familyCardCreated",
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
  data: FamilyCardModel;
  id: string;
  setProcessing: (val: boolean) => void;
  setEditingRecord: (data: FamilyCardModel | undefined) => void;
  fetchData: () => void;
}

export const familyCardUpdated = async ({
  data,
  form,
  id,
  messageApi,
  notificationApi,
  setProcessing,
  setEditingRecord,
  fetchData,
}: UpdateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "familyCardUpdated", "Family Card Update");
    const response = await updateFamilyCard(id, data);
    if (response.status == 200) {
      processSuccessN(
        notificationApi,
        "familyCardUpdated",
        response.data?.message || "Update Success",
        () => {
          form.resetFields();
          fetchData();
          setEditingRecord(undefined);
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError?.response?.status == 400) {
      console.log(axiosError?.response?.data);

      processErrorN(notificationApi, "familyCardCreated", form, axiosError);
    } else if (axiosError.response?.status == 404) {
      processFail(
        messageApi,
        "familyCardCreated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "familyCardCreated",
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
  fetchFamilyCard: () => void;
}

export const familyCardDeleted = async ({
  fetchFamilyCard,
  id,
  messageApi,
  notificationApi,
  setProcessing,
}: DeleteProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "familyCardDeleted", "Family Card Delete");
    const response = await deleteFamilyCard(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "familyCardDeleted",
        response.data.message || "Delete Success",
        () => {
          fetchFamilyCard();
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status == 404) {
      processFail(
        messageApi,
        "familyCardDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "familyCardDeleted",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
