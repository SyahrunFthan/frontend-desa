import { Button, DatePicker, Flex, Form, Select, type FormProps } from "antd";
import type { TFunction } from "i18next";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { status, type Option } from "../../models/global";
import {
  monthOption,
  socialAssistanceState,
  type SocialAssistanceModel,
} from "../../models/socialAssistance";
import { socialAssistanceUpdated } from "../../services/socialAssistance";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import dayjs from "dayjs";

interface Props {
  t: TFunction;
  residents: Option[];
  assistances: Option[];
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  record: SocialAssistanceModel;
  setRecord: Dispatch<SetStateAction<SocialAssistanceModel>>;
  fetchData: () => void;
}

const SocialAssistanceEdit = ({
  assistances,
  residents,
  t,
  setOpenDrawer,
  fetchData,
  messageApi,
  notificationApi,
  record,
  setRecord,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm();

  const handleUpdate: FormProps["onFinish"] = (values) => {
    const data = {
      resident_id: values.resident_id ?? "",
      assistance_id: values.assistance_id ?? "",
      status_assistance: values.status_assistance ?? "",
      month_of_aid: values.month_of_aid ?? "",
      receipt_at: values.receipt_at ?? "",
    };

    socialAssistanceUpdated({
      data,
      fetchData,
      form,
      messageApi,
      notificationApi,
      record,
      setOpenDrawer,
      setProcessing,
      setRecord,
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      ...record,
      receipt_at: dayjs(record.receipt_at, "YYYY-MM-DD"),
    });
  }, [record]);

  return (
    <Form form={form} layout="vertical" onFinish={handleUpdate}>
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
              setTimeout(() => {
                setRecord(socialAssistanceState);
              }, 100);
            }}
          >
            {t("button.back")}
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default SocialAssistanceEdit;
