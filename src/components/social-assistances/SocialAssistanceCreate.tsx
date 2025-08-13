import { Button, DatePicker, Flex, Form, Select, type FormProps } from "antd";
import type { TFunction } from "i18next";
import { useState, type Dispatch, type SetStateAction } from "react";
import { status, type Option } from "../../models/global";
import { monthOption } from "../../models/socialAssistance";
import { socialAssistanceCreated } from "../../services/socialAssistance";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";

interface Props {
  t: TFunction;
  residents: Option[];
  assistances: Option[];
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  fetchData: () => void;
}

const SocialAssistanceCreate = ({
  assistances,
  residents,
  t,
  setOpenDrawer,
  fetchData,
  messageApi,
  notificationApi,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm();

  const handleCreate: FormProps["onFinish"] = (values) => {
    const data = {
      resident_id: values.resident_id ?? "",
      assistance_id: values.assistance_id ?? "",
      status_assistance: values.status_assistance ?? "",
      month_of_aid: values.month_of_aid ?? "",
      receipt_at: values.receipt_at ?? "",
    };

    socialAssistanceCreated({
      data,
      fetchData,
      form,
      messageApi,
      notificationApi,
      setOpenDrawer,
      setProcessing,
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleCreate}>
      <Form.Item
        name={"resident_id"}
        label={t("social_assistance.resident_id")}
        required
      >
        <Select
          showSearch
          options={residents}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>
      <Form.Item
        name={"assistance_id"}
        label={t("social_assistance.assistance_id")}
        required
      >
        <Select
          showSearch
          options={assistances}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>
      <Form.Item
        name={"status_assistance"}
        label={t("social_assistance.status_assistance")}
        required
      >
        <Select options={status} />
      </Form.Item>
      <Form.Item
        name={"month_of_aid"}
        label={t("social_assistance.month_of_aid")}
        required
      >
        <Select options={monthOption} />
      </Form.Item>
      <Form.Item
        name={"receipt_at"}
        label={t("social_assistance.receipt_at")}
        required
      >
        <DatePicker className="w-full" />
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

export default SocialAssistanceCreate;
