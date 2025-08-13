import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  type FormProps,
} from "antd";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  typeAssistances,
  type AssistanceCategoryModel,
} from "../../models/assistanceCategory";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { TFunction } from "i18next";
import { status } from "../../models/global";
import { assistanceCategoryUpdated } from "../../services/assistanceCategory";

interface Props {
  record: AssistanceCategoryModel;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  setRecord: Dispatch<SetStateAction<AssistanceCategoryModel>>;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  t: TFunction;
  fetchData: () => void;
}

const AssistanceCategoryEdit = ({
  record,
  setOpenDrawer,
  messageApi,
  notificationApi,
  t,
  setRecord,
  fetchData,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm();
  const paymenType = Form.useWatch("type_assistance", form);

  const handleUpdate: FormProps["onFinish"] = (values) => {
    const data = {
      name: values.name ?? "",
      type_assistance: values.type_assistance ?? "",
      description: values.description ?? "",
      amount: values.amount ?? null,
      status: values.status ?? "",
      year: values.year ?? 0,
      id: record.id ?? "",
    };

    assistanceCategoryUpdated({
      data,
      fetchData,
      form,
      id: record.id,
      messageApi,
      notificationApi,
      setRecord,
      setOpenDrawer,
      setProcessing,
    });
  };

  useEffect(() => {
    form.setFieldsValue(record);
  }, [record.id]);

  return (
    <Form
      key={record?.id ?? "new"}
      layout="vertical"
      form={form}
      onFinish={handleUpdate}
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
          onChange={(v) => {
            if (v !== "cash") {
              form.setFieldsValue({ amount: record.amount });
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
            {t("button.save")}
          </Button>
          <Button
            htmlType="button"
            onClick={() => {
              form.resetFields();
              setOpenDrawer(false);
              setRecord({
                amount: 0,
                description: "",
                id: "",
                name: "",
                status: "",
                type_assistance: "",
                year: 2020,
              });
            }}
          >
            {t("button.back")}
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default AssistanceCategoryEdit;
