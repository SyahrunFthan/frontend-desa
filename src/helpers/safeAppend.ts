import type { FormAppend } from "../models/global";

const safeAppend = ({ key, value, formData }: FormAppend) => {
  if (typeof value === "boolean") {
    formData.append(key, String(value));
  } else if (value !== undefined && value !== null) {
    formData.append(key, value as string);
  } else {
    formData.append(key, "");
  }
};

export default safeAppend;
