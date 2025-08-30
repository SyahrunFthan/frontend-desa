import type { UploadFile } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { Dispatch, SetStateAction } from "react";
import { processFail } from "./process";

interface UploadProps {
  info: any;
  setFile: Dispatch<SetStateAction<UploadFile[]>>;
  setPreviewUrl: Dispatch<SetStateAction<string>>;
}

export const handleUpload = ({ info, setFile, setPreviewUrl }: UploadProps) => {
  const { fileList } = info;

  const limitedFileList = fileList.slice(-1);
  setFile(limitedFileList);

  if (limitedFileList.length > 0) {
    const file = limitedFileList[0];
    if (file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file.originFileObj);
    }
  } else {
    setPreviewUrl("");
  }
};

interface BeforeUploadProps {
  file: File;
  messageApi: MessageInstance;
}

export const beforeUpload = ({ file, messageApi }: BeforeUploadProps) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    processFail(messageApi, "beforeUpload", "File harus berupa gambar");
    return false;
  }

  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    processFail(
      messageApi,
      "beforeUpload",
      "Ukuran gambar harus kurang dari 5MB!"
    );
    return false;
  }

  return false;
};
