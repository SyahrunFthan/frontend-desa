import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  type FormProps,
} from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { TFunction } from "i18next";
import { useState } from "react";
import { typeAssistances } from "../../models/assistanceCategory";
import { assistanceCategoryCreated } from "../../services/assistanceCategory";
import { status } from "../../models/global";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  t: TFunction;
  fetchData: () => void;
}

const AssistanceCategoryCreate = ({
  messageApi,
  notificationApi,
  t,
  fetchData,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm();
  const paymenType = Form.useWatch("type_assistance", form);

  const handleCreate: FormProps["onFinish"] = (values) => {
    const data = {
      name: values.name ?? "",
      type_assistance: values.type_assistance ?? "",
      description: values.description ?? "",
      amount: values.amount ?? null,
      status: values.status ?? "",
      year: values.year ?? 0,
    };

    assistanceCategoryCreated({
      data,
      fetchData,
      form,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className="w-full lg:w-[60%]"
      onFinish={handleCreate}
    >
      <Form.Item
        name={"name"}
        label={t("social_assistance.category.name")}
        required
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"status"}
        label={t("social_assistance.category.status")}
        required
      >
        <Select options={status} />
      </Form.Item>
      <Form.Item
        name={"year"}
        label={t("social_assistance.category.year")}
        required
      >
        <InputNumber
          controls={false}
          className="w-full"
          maxLength={4}
          min={2020}
        />
      </Form.Item>
      <Form.Item
        name={"type_assistance"}
        label={t("social_assistance.category.type_assistance")}
        required
      >
        <Select
          options={typeAssistances}
          onChange={(value) => {
            if (value !== "cash") {
              form.setFieldsValue({ amount: null });
            }
          }}
        />
      </Form.Item>

      {paymenType === "cash" && (
        <Form.Item
          name={"amount"}
          label={t("social_assistance.category.amount")}
          required
        >
          <InputNumber
            controls={false}
            className="w-full"
            formatter={(value) =>
              `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            }
            parser={(value) => {
              if (!value) return "";
              return value.replace(/[^0-9]/g, "");
            }}
          />
        </Form.Item>
      )}
      <Form.Item
        name={"description"}
        label={t("social_assistance.category.description")}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item style={{ textAlign: "start" }}>
        <Flex gap="small">
          <Button
            loading={processing}
            type="primary"
            htmlType="submit"
            disabled={processing}
          >
            {/* {id ? t("button.save") : t("button.add")} */}
            {t("button.add")}
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
  );
};

export default AssistanceCategoryCreate;
