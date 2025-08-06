import {
  Button,
  Card,
  DatePicker,
  Flex,
  Form,
  Input,
  Select,
  Typography,
  Upload,
  type FormProps,
  type UploadFile,
  type UploadProps,
} from "antd";
import { useTranslation } from "react-i18next";
import {
  outgoingStatusLetters,
  type OutgoingLetterModel,
} from "../../models/outgoingLetter";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { outgoingLetterCreated } from "../../services/outgoingLetter";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  fetchData: () => void;
}

const OutgoingLetterCreate = ({
  fetchData,
  messageApi,
  notificationApi,
}: Props) => {
  const [file, setFile] = useState<UploadFile[] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm<Omit<OutgoingLetterModel, "id">>();
  const { t } = useTranslation();

  const handleChangeFile: UploadProps["onChange"] = ({ fileList }) => {
    setFile(fileList);
  };

  const handleSubmit: FormProps["onFinish"] = (
    values: Omit<OutgoingLetterModel, "id">
  ) => {
    let formData = new FormData();
    formData.append("code", values.code ?? "");
    formData.append("date_of_letter", values.date_of_letter ?? "");
    formData.append("objective", values.objective ?? "");
    formData.append("regarding", values.regarding ?? "");
    formData.append("status_letter", values.status_letter ?? "");

    if (values.summary) {
      formData.append("summary", values.summary);
    }

    if (file?.length && file[0]?.originFileObj) {
      formData.append("file", file[0].originFileObj);
    }

    outgoingLetterCreated({
      data: formData,
      fetchData,
      form,
      messageApi,
      notificationApi,
      setFile,
      setProcessing,
    });
  };

  return (
    <Card>
      <Typography.Title level={3}>
        {t("outgoingLetters.create")}
      </Typography.Title>

      <Form
        layout="vertical"
        form={form}
        className="w-full lg:w-[25%]"
        onFinish={handleSubmit}
      >
        <Form.Item name={"code"} label={t("outgoingLetters.code")} required>
          <Input />
        </Form.Item>
        <Form.Item
          name={"date_of_letter"}
          label={t("outgoingLetters.dateOfLetter")}
          required
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          name={"objective"}
          label={t("outgoingLetters.objective")}
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"regarding"}
          label={t("outgoingLetters.regarding")}
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"status_letter"}
          label={t("outgoingLetters.statusLetter")}
          required
        >
          <Select placeholder="Select Status" options={outgoingStatusLetters} />
        </Form.Item>
        <Form.Item name={"summary"} label={t("outgoingLetters.summary")}>
          <TextArea />
        </Form.Item>
        <Form.Item
          name={"file"}
          label={t("outgoingLetters.chooseFile")}
          required
        >
          <Upload
            accept=".pdf"
            beforeUpload={() => false}
            showUploadList
            listType="picture"
            multiple={false}
            maxCount={1}
            fileList={file ?? []}
            onChange={handleChangeFile}
          >
            <Button icon={<UploadOutlined />}>Upload File</Button>
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
              }}
            >
              {t("button.reset")}
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default OutgoingLetterCreate;
