import { useState } from "react";
import { Upload, Button, Tooltip, type UploadProps } from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { UploadFile } from "antd/lib";
import { periodUploaded } from "../../services/period";

interface Props {
  value?: string;
  path_file?: string;
  id: string;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  fetchData: () => void;
}

export const PeriodUpload = ({
  value,
  path_file,
  id,
  messageApi,
  notificationApi,
  fetchData,
}: Props) => {
  const [localFileList, setLocalFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange: UploadProps["onChange"] = async (info) => {
    const newFileList = info.fileList.slice(-1);
    setLocalFileList(newFileList);

    const rawFile = newFileList[0]?.originFileObj;
    if (!rawFile) return;

    const formData = new FormData();
    formData.append("file", rawFile);

    periodUploaded({
      data: formData,
      fetchData,
      id,
      messageApi,
      notificationApi,
      setFile: setLocalFileList,
      setLoading,
    });
  };

  return (
    <>
      {value ? (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Tooltip title="Download">
            <Link
              to={path_file || ""}
              target="_blank"
              className="text-blue-500"
            >
              <DownloadOutlined />
            </Link>
          </Tooltip>

          <Upload
            accept=".pdf"
            beforeUpload={() => false}
            showUploadList={false}
            multiple={false}
            maxCount={1}
            onChange={handleChange}
            fileList={[]}
          >
            <Tooltip title="Edit / Replace File">
              <Button
                icon={<EditOutlined />}
                size="small"
                disabled={loading}
                loading={loading}
              />
            </Tooltip>
          </Upload>
        </div>
      ) : (
        <Upload
          accept=".pdf"
          beforeUpload={() => false}
          showUploadList
          listType="text"
          multiple={false}
          maxCount={1}
          fileList={localFileList}
          onChange={handleChange}
        >
          <Button disabled={loading} loading={loading}>
            <UploadOutlined />
            Upload File
          </Button>
        </Upload>
      )}
    </>
  );
};
