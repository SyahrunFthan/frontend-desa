import { Button, Upload, type UploadFile } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { TFunction } from "i18next";
import { useEffect, useState } from "react";
import { beforeUpload, handleUpload } from "../../helpers/uploader";
import {
  DeleteOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { VillageModel } from "../../models/village";
import type { NotificationInstance } from "antd/es/notification/interface";
import { villageImageUpdated } from "../../services/village";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  data: VillageModel | null;
  t: TFunction;
}
const VillagePhoto = ({ messageApi, t, data, notificationApi }: Props) => {
  const [file, setFile] = useState<UploadFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  const handleRemove = () => {
    setFile([]);
    setPreviewUrl("");
  };

  const handleSave = () => {
    let formData = new FormData();
    if (file.length && file[0].originFileObj) {
      formData.append("file", file[0].originFileObj);
    }

    villageImageUpdated({
      data: formData,
      id: data?.id ?? "",
      messageApi,
      notificationApi,
      setFile,
      setProcessing,
    });
  };

  useEffect(() => {
    if (data) {
      const initialFile: UploadFile = {
        uid: data.id,
        name: data.image,
        url: data.path_image,
      };
      setFile([initialFile]);
      setPreviewUrl(data.path_image);
    }
  }, [data]);

  return (
    <div className="w-full mx-auto">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        {!previewUrl ? (
          <Upload
            fileList={file}
            onChange={(info) =>
              handleUpload({
                info: info,
                setFile: setFile,
                setPreviewUrl: setPreviewUrl,
              })
            }
            beforeUpload={(file) =>
              beforeUpload({ file: file, messageApi: messageApi })
            }
            accept="image/*"
            showUploadList={false}
            className="flex items-center justify-center"
            maxCount={1}
            multiple={false}
          >
            <div className="flex flex-col items-center justify-center py-8">
              <UploadOutlined className="text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500 mb-2">
                Klik atau seret gambar ke sini
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, JPEG (Maks. 5MB)
              </p>
              <Button type="primary" className="mt-4" icon={<UploadOutlined />}>
                Pilih Gambar
              </Button>
            </div>
          </Upload>
        ) : (
          <div className="text-center">
            <div className="relative inline-block mb-4 aspect-video w-full max-w-[300px] rounded-lg overflow-hidden border shadow-sm bg-white">
              <img
                src={previewUrl}
                alt="Logo Desa"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>

            <div className="flex justify-center gap-2">
              <Button
                type="default"
                size="small"
                icon={<SaveOutlined />}
                onClick={handleSave}
                disabled={processing}
                loading={processing}
              >
                {t("button.save")}
              </Button>

              <Upload
                fileList={file}
                onChange={(info) =>
                  handleUpload({
                    info: info,
                    setFile: setFile,
                    setPreviewUrl: setPreviewUrl,
                  })
                }
                beforeUpload={(file) =>
                  beforeUpload({ file: file, messageApi: messageApi })
                }
                accept="image/*"
                showUploadList={false}
                maxCount={1}
                multiple={false}
              >
                <Button
                  type="primary"
                  size="small"
                  disabled={processing}
                  icon={<UploadOutlined />}
                >
                  Ganti
                </Button>
              </Upload>

              <Button
                type="default"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={handleRemove}
                disabled={processing}
              >
                Hapus
              </Button>
            </div>

            {file[0] && (
              <div className="mt-3 text-xs text-gray-500">
                <p>Nama file: {file[0].name}</p>
                <p>Ukuran: {(file[0].size! / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Informasi tambahan */}
      <div className="mt-4 text-xs text-gray-500">
        <p>• Ukuran gambar yang disarankan: 1920x1080 piksel</p>
        <p>• Format yang didukung: PNG, JPG, JPEG</p>
        <p>• Ukuran maksimal: 3MB</p>
      </div>
    </div>
  );
};

export default VillagePhoto;
