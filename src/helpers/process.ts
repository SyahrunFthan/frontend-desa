import type { FormInstance } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { AxiosError } from "axios";
import type { FieldData } from "rc-field-form/es/interface";
import { isStrictStringNumber } from "./utils";

export function processStart(
  api: MessageInstance,
  key: string,
  content: string
) {
  api.open({
    key: key,
    type: "loading",
    content: content,
    duration: 0,
  });
}

export function processStartN(api: NotificationInstance, key: string) {
  api.info({
    key: key,
    message: "process",
    description: "process",
    duration: 0,
  });
}

export function processSuccess(
  api: MessageInstance,
  key: string,
  content: string,
  extra: () => void
) {
  setTimeout(() => {
    api.open({
      key: key,
      type: "success",
      content: content,
      duration: 1.5,
      onClose: () => {
        extra();
      },
    });
  }, 500);
}

export function processSuccessN(
  api: NotificationInstance,
  key: string,
  content: string,
  extra: () => void
) {
  setTimeout(() => {
    api.success({
      key: key,
      message: "Success",
      description: content,
      onClose: () => {
        extra();
      },
      duration: 1.5,
    });
  }, 500);
}

export function processFail(
  api: MessageInstance,
  key: string,
  content: string
) {
  setTimeout(() => {
    api.open({
      key: key,
      type: "error",
      content: content,
      duration: 1.5,
    });
  }, 500);
}

export function processFailN(
  api: NotificationInstance,
  key: string,
  content: string
) {
  setTimeout(() => {
    api.error({
      key: key,
      message: "error",
      description: content,
      duration: 1.5,
    });
  }, 500);
}

export function processFinish(api: MessageInstance, extra: () => void) {
  setTimeout(() => {
    api.destroy();
    extra();
  }, 250);
}

export function processErrorN(
  api: NotificationInstance,
  key: string,
  form: FormInstance | undefined,
  errs: AxiosError
) {
  const fields: FieldData[] = [];
  const errorData = errs.response?.data;

  if (!errorData || typeof errorData !== "object") {
    processFailN(api, key, "Terjadi kesalahan tidak diketahui.");
    return;
  }

  Object.entries(errorData).forEach(([field, message]) => {
    if (isStrictStringNumber(field)) {
      processFailN(api, key, String(message));
      return;
    }

    const fieldSplit = field.split(".");
    let data: { name: string | (string | number)[]; errors: string[] } = {
      name: field,
      errors: [String(message)],
    };

    if (fieldSplit.length > 1 && !isNaN(Number(fieldSplit[1]))) {
      data = {
        name: [fieldSplit[0], parseInt(fieldSplit[1])],
        errors: [String(message)],
      };
    }

    fields.push(data);
  });
  if (form) {
    const allFieldNames = form.getFieldsValue(true);

    const clearFields = Object.keys(allFieldNames).map((key) => ({
      name: key,
      errors: [],
    }));

    form.setFields(clearFields);

    if (fields.length > 0) {
      form.setFields(fields);
    }
  }
}
