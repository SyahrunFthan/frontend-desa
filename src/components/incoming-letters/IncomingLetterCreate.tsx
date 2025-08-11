import { UploadOutlined } from "@ant-design/icons";
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
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { status_letters } from "../../models/incomingLetter";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { incomingLetterCreated } from "../../services/incomingLetter";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  fetchData: () => void;
}

const IncomingLetterCreate = ({
  fetchData,
  messageApi,
  notificationApi,
}: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [file, setFile] = useState<UploadFile[] | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleChangeFile: UploadProps["onChange"] = ({ fileList }) => {
    setFile(fileList);
  };

  const handleSubmit: FormProps["onFinish"] = (values) => {
    let formData = new FormData();
    formData.append("code", values.code ?? "");
    formData.append("date_of_letter", values.date_of_letter ?? "");
    formData.append("date_of_receipt", values.date_of_receipt ?? "");
    formData.append("sender", values.sender ?? "");
    formData.append("regarding", values.regarding ?? "");
    formData.append("status_letter", values.status_letter ?? "");
    formData.append("summary", values.summary ?? "");

    if (file?.length && file[0]?.originFileObj) {
      formData.append("file", file[0].originFileObj);
    }

    incomingLetterCreated({
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
      <Typography.Title level={3}>{t("create")}</Typography.Title>

      <Form
        layout="vertical"
        form={form}
        className="w-full lg:w-[30%]"
        onFinish={handleSubmit}
      >
        <Form.Item label={t("incoming letters.code")} name={"code"} required>
          <Input />
        </Form.Item>
        <Form.Item
          label={t("incoming letters.date of letter")}
          name={"date_of_letter"}
          required
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          label={t("incoming letters.date of receipt")}
          name={"date_of_receipt"}
          required
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          label={t("incoming letters.sender")}
          name={"sender"}
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t("incoming letters.regarding")}
          name={"regarding"}
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"status_letter"}
          label={t("incoming letters.status letter")}
          required
        >
          <Select options={status_letters} />
        </Form.Item>

        <Form.Item
          name={"file"}
          label={t("incoming letters.choose file")}
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
        <Form.Item label={t("incoming letters.summary")} name={"summary"}>
          <TextArea />
        </Form.Item>

        <Form.Item style={{ textAlign: "start" }}>
          <Flex gap="small">
            <Button
              loading={processing}
              type="primary"
              htmlType="submit"
              disabled={processing}
            >
              {t("button.add")}
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

export default IncomingLetterCreate;
