import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Select,
  Upload,
  type FormProps,
  type UploadFile,
} from "antd";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import RichTextEditor from "../text-editor/TextEditor";
import { UploadOutlined } from "@ant-design/icons";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { TFunction } from "i18next";
import { status_news, type NewsModel } from "../../models/news";
import dayjs from "dayjs";
import { newsUpdated } from "../../services/news";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  t: TFunction;
  record: NewsModel | null;
  setRecord: Dispatch<SetStateAction<NewsModel | null>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}

const NewsEdit = (params: Props) => {
  const {
    messageApi,
    notificationApi,
    t,
    record,
    setRecord,
    setOpenDrawer,
    fetchData,
  } = params;

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

    newsUpdated({
      data: formData,
      id: record?.id ?? "",
      messageApi,
      notificationApi,
      form,
      setProcessing,
      setFile,
      fetchData,
      setContent,
      setRecord,
      setOpenDrawer,
    });
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        ...record,
        date_of_issue: dayjs(record.date_of_issue, "YYYY-MM-DD"),
      });
      setContent(record.content);

      if (record.image !== "activity.png") {
        setFile([
          {
            uid: record.id,
            name: record.image,
            status: "done",
            url: record.path_image,
          },
        ]);
      }
    }
  }, [record]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
              setRecord(null);
              setOpenDrawer(false);
            }}
          >
            {t("button.back")}
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default NewsEdit;
