import { Button, Card, Flex, Form, Input, InputNumber, Typography } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { useState } from "react";
import { familyCardCreated } from "../../services/familyCard";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  fetchFamilyCard: () => void;
}

const FamilyCardCreate = ({
  messageApi,
  notificationApi,
  fetchFamilyCard,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  return (
    <Card>
      <Typography.Title level={3}>Create Family Card</Typography.Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          const data = {
            family_id: String(values.family_id) || "",
            address: values.address || "",
          };

          familyCardCreated({
            data: { ...data, total_family: values.total_family || 0 },
            messageApi,
            fetchFamilyCard,
            form,
            notificationApi,
            setProcessing,
          });
        }}
        className="w-full lg:w-[80%]"
      >
        <Form.Item name={"family_id"} label="ID Family" required>
          <InputNumber
            controls={false}
            className="w-full"
            placeholder="Ex: 720xxxx"
            maxLength={16}
          />
        </Form.Item>
        <Form.Item name={"address"} label="Address" required>
          <TextArea placeholder="Ex: Dusun I"></TextArea>
        </Form.Item>
        <Form.Item name={"total_family"} label="Total Family" required>
          <InputNumber
            placeholder="Ex: 2"
            min={1}
            className="w-full lg:w-[20%]"
          />
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

export default FamilyCardCreate;
