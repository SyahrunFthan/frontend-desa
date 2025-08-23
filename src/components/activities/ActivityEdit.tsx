import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Upload,
  type UploadFile,
} from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { activityState, type ActivityModel } from "../../models/activity";
import type { TFunction } from "i18next";
import dayjs from "dayjs";
import { activityUpdated } from "../../services/activity";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  record: ActivityModel;
  setRecord: Dispatch<SetStateAction<ActivityModel>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  t: TFunction;
  fetchData: () => void;
}

const ActivityEdit = ({
  t,
  fetchData,
  messageApi,
  notificationApi,
  record,
  setOpenDrawer,
  setRecord,
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

    activityUpdated({
      data: formData,
      id: record.id,
      fetchData,
      form,
      messageApi,
      notificationApi,
      setOpenDrawer,
      setProcessing,
      setRecord,
      setFile,
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      ...record,
      date_of_activity: dayjs(record.date_of_activity, "YYYY-MM-DD"),
    });
    setFile([
      {
        uid: record.id,
        name: record?.image ?? "",
        url: record?.path_image ?? "",
      },
    ]);
  }, [record]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
              setFile(null);
              setOpenDrawer(false);
              setRecord(activityState);
            }}
          >
            {t("button.back")}
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default ActivityEdit;
