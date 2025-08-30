import { Button, Form, Input, Space, type FormProps } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { TFunction } from "i18next";
import RichTextEditor from "../text-editor/TextEditor";
import { useEffect, useState } from "react";
import type { VillageModel } from "../../models/village";
import { villageAboutUpdated } from "../../services/village";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  data: VillageModel | null;
  t: TFunction;
}

const VillageFormAbout = ({ t, messageApi, notificationApi, data }: Props) => {
  const [aboutContent, setAboutContent] = useState<string>("");
  const [historyContent, setHistoryContent] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit: FormProps["onFinish"] = (values) => {
    const body: Pick<VillageModel, "name" | "about" | "history"> = {
      name: values.name,
      about: values.about,
      history: values.history,
    };

    villageAboutUpdated({
      data: body,
      id: data?.id ?? "",
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
      setAboutContent(data.about);
      setHistoryContent(data.history);
    }
  }, [data]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name={"name"}
        label={t("village.name")}
        className="w-full lg:w-[30%]"
        required
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"about"}
        label={t("village.about")}
        required
        rules={[{ required: true, min: 20 }]}
      >
        <RichTextEditor value={aboutContent} onChange={setAboutContent} />
      </Form.Item>
      <Form.Item
        name={"history"}
        label={t("village.history")}
        required
        rules={[{ required: true, min: 20 }]}
      >
        <RichTextEditor value={historyContent} onChange={setHistoryContent} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            disabled={processing}
            loading={processing}
          >
            {t("button.save")}
          </Button>
          <Button
            onClick={() => {
              form.setFieldsValue(data);
              setAboutContent(data?.about ?? "");
              setHistoryContent(data?.history ?? "");
            }}
            disabled={processing}
            loading={processing}
          >
            {t("button.reset")}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default VillageFormAbout;
