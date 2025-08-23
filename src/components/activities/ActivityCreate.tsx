import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Typography,
  Upload,
  type UploadFile,
} from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { TFunction } from "i18next";
import { useState } from "react";
import type { ActivityModel } from "../../models/activity";
import { activityCreated } from "../../services/activity";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  t: TFunction;
  fetchData: () => void;
}

const ActivityCreate = ({
  messageApi,
  notificationApi,
  t,
  fetchData,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const [file, setFile] = useState<UploadFile[] | null>(null);
  const [form] = Form.useForm();

  const handleSubmit = (values: ActivityModel) => {
    let formData = new FormData();
    formData.append("name", values.name ?? "");
    formData.append("date_of_activity", values.date_of_activity ?? "");
    formData.append("location", values.location ?? "");

    if (file?.length && file[0].originFileObj) {
      formData.append("file", file[0].originFileObj);
    }

    activityCreated({
      data: formData,
      fetchData,
      form,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  return (
    <>
      <Typography.Title level={3}>{t("activity.createOf")}</Typography.Title>

      <Form
        layout="vertical"
        form={form}
        className="w-full lg:w-[50%]"
        onFinish={handleSubmit}
      >
        <Form.Item name={"name"} label={t("activity.name")} required>
          <Input />
        </Form.Item>
        <Form.Item
          name={"date_of_activity"}
          label={t("activity.date_of_activity")}
          required
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item name={"location"} label={t("activity.location")} required>
          <Input />
        </Form.Item>
        <Form.Item name={"file"} label={t("activity.file")}>
          <Upload
            fileList={file ?? []}
            multiple={false}
            maxCount={1}
            showUploadList
            accept="image/*"
            listType="picture"
            beforeUpload={() => false}
            onChange={(info) => {
              setFile(info.fileList);
            }}
          >
            <Button>Upload Image</Button>
          </Upload>
        </Form.Item>
        <Form.Item style={{ textAlign: "start" }}>
          <Flex gap="small">
            <Button
              loading={processing}
              type="primary"
              htmlType="submit"
              disabled={processing}
            >
              {t("button.save")}
            </Button>
            <Button
              htmlType="button"
              onClick={() => {
                form.resetFields();
              }}
            >
              {t("button.reset")}
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </>
  );
};

export default ActivityCreate;
