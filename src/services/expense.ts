import type { FormInstance } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { ExpenseModel } from "../models/expense";
import type { Dispatch, SetStateAction } from "react";
import {
  processErrorN,
  processFail,
  processFinish,
  processStart,
  processSuccessN,
} from "../helpers/process";
import { createExpense, deleteExpense, updateExpense } from "../apis";
import type { AxiosError } from "axios";

interface CreateProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  data: Omit<ExpenseModel, "id" | "period" | "income">;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const expenseCreated = async ({
  data,
  fetchData,
  form,
  messageApi,
  notificationApi,
  setProcessing,
}: CreateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "expenseCreated", "Creating Expense");
    const response = await createExpense(data);
    if (response.status === 201) {
      processSuccessN(
        notificationApi,
        "expenseCreated",
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
      processErrorN(notificationApi, "expenseCreated", form, axiosError);
    } else {
      processFail(
        messageApi,
        "expenseCreated",
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
  data: Omit<ExpenseModel, "period" | "income">;
  id: string;
  setProcessing: Dispatch<SetStateAction<boolean>>;
  setId: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

export const expenseUpdated = async ({
  data,
  fetchData,
  form,
  messageApi,
  notificationApi,
  setProcessing,
  id,
  setId,
  setOpen,
}: UpdateProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "expenseUpdated", "Updating Expense");
    const response = await updateExpense(id, data);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "expenseUpdated",
        response.data.message || "Success",
        () => {
          fetchData();
          form.resetFields();
          setId("");
          setOpen(false);
        }
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 400) {
      processErrorN(notificationApi, "expenseUpdated", form, axiosError);
    } else if (axiosError.response?.status === 404) {
      processFail(
        messageApi,
        "expenseUpdated",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "expenseUpdated",
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

export const expenseDeleted = async ({
  fetchData,
  messageApi,
  notificationApi,
  setProcessing,
  id,
}: DeleteProps) => {
  try {
    setProcessing(true);
    processStart(messageApi, "expenseDeleted", "Updating Expense");
    const response = await deleteExpense(id);
    if (response.status === 200) {
      processSuccessN(
        notificationApi,
        "expenseDeleted",
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
        "expenseDeleted",
        axiosError.response?.data?.message || "Not Found"
      );
    } else {
      processFail(
        messageApi,
        "expenseDeleted",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  } finally {
    processFinish(messageApi, () => {
      setProcessing(false);
    });
  }
};
