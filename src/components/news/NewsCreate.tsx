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
} from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { TFunction } from "i18next";
import { useState } from "react";
import RichTextEditor from "../text-editor/TextEditor";
import { UploadOutlined } from "@ant-design/icons";
import { newsCreated } from "../../services/news";
import { status_news } from "../../models/news";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  t: TFunction;
  fetchData: () => void;
}

const NewsCreate = (params: Props) => {
  const { messageApi, notificationApi, t, fetchData } = params;
  const [file, setFile] = useState<UploadFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [content, setContent] = useState("");
  const [form] = Form.useForm();

  const handleSubmit: FormProps["onFinish"] = (values) => {
    let formData = new FormData();
    formData.append("title", values.title ?? "");
    formData.append("author", values.author ?? "");
    formData.append("date_of_issue", values.date_of_issue ?? "");
    formData.append("content", content ?? "");
    formData.append("status", values.status ?? "");

    if (values.summary) {
      formData.append("summary", values.summary);
    }

    if (file.length && file[0].originFileObj) {
      formData.append("file", file[0].originFileObj);
    }

    newsCreated({
      data: formData,
      messageApi,
      notificationApi,
      form,
      setProcessing,
      setFile,
      fetchData,
      setContent,
    });
  };

  return (
    <Card>
      <Typography.Title level={3}>{t("news.createOf")}</Typography.Title>
      <Form
        form={form}
        layout="vertical"
        className="w-full lg:w-[25%]"
        onFinish={handleSubmit}
      >
        <Form.Item name={"title"} label={t("news.title_news")} required>
          <Input />
        </Form.Item>
        <Form.Item name={"author"} label={t("news.author")} required>
          <Input />
        </Form.Item>
        <Form.Item
          name={"date_of_issue"}
          label={t("news.date_of_issue")}
          required
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item name={"status"} label={t("news.status")} required>
          <Select options={status_news} />
        </Form.Item>
        <Form.Item name={"summary"} label={t("news.summary")}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item name={"content"} label={t("news.content")} required>
          <RichTextEditor value={content} onChange={setContent} />
        </Form.Item>
        <Form.Item name={"file"} label={t("news.choose_image")}>
          <Upload
            beforeUpload={() => false}
            fileList={file}
            accept="image/*"
            showUploadList
            listType="picture"
            maxCount={1}
            multiple={false}
            onChange={(info) => setFile(info.fileList)}
            onRemove={() => setFile([])}
          >
            <Button icon={<UploadOutlined />}>{t("news.choose_image")}</Button>
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
                setContent("");
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

export default NewsCreate;
