import { Form, Button, Space, type FormProps } from "antd";
import { useEffect, useState } from "react";
import type { TFunction } from "i18next";
import RichTextEditor from "../text-editor/TextEditor";
import type { VillageModel } from "../../models/village";
import { villageVissionUpdated } from "../../services/village";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";

interface Props {
  t: TFunction;
  data: VillageModel | null;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
}

const VillageFormVision = ({ t, data, messageApi, notificationApi }: Props) => {
  const [form] = Form.useForm();
  const [vissionContent, setVissionContent] = useState<string>("");
  const [missionContent, setMissionContent] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit: FormProps["onFinish"] = (values) => {
    const body: Pick<VillageModel, "vission" | "mission"> = {
      vission: values.vission,
      mission: values.mission,
    };

    villageVissionUpdated({
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
      setMissionContent(data.mission);
      setVissionContent(data.vission);
    }
  }, [data]);

  return (
    <div className="mx-auto">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6"
      >
        <Form.Item
          name="vission"
          label={t("village.vission")}
          required
          rules={[{ required: true, min: 20 }]}
        >
          <RichTextEditor value={vissionContent} onChange={setVissionContent} />
        </Form.Item>

        <Form.Item
          name="mission"
          label={t("village.mission")}
          required
          rules={[{ required: true, min: 20 }]}
        >
          <RichTextEditor value={missionContent} onChange={setMissionContent} />
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
                setMissionContent(data?.mission ?? "");
                setVissionContent(data?.vission ?? "");
              }}
              disabled={processing}
              loading={processing}
            >
              {t("button.reset")}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VillageFormVision;
