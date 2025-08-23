import {
  Button,
  Flex,
  Form,
  InputNumber,
  type FormInstance,
  type FormProps,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { PeriodModel } from "../../models/period";
import { periodCreated, periodUpdated } from "../../services/period";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";

interface Props {
  fetchData: () => void;
  setId: (id: string) => void;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  id: string;
}

const PeriodCreate = ({
  fetchData,
  messageApi,
  notificationApi,
  form,
  id,
  setId,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const { t } = useTranslation();

  const handleSubmit: FormProps["onFinish"] = (values: PeriodModel) => {
    if (id) {
      const data = {
        year: values.year || 0,
        description: values.description || "",
        id: id || "",
      };

      periodUpdated({
        data,
        fetchData,
        form,
        id,
        messageApi,
        notificationApi,
        setId,
        setProcessing,
      });
    } else {
      const data = {
        year: values.year || 0,
        description: values.description || "",
      };

      periodCreated({
        data,
        fetchData,
        form,
        messageApi,
        notificationApi,
        setProcessing,
      });
    }
  };

  return (
    <div className="w-full">
      <Form
        className="w-full lg:w-[60%]"
        layout="vertical"
        onFinish={handleSubmit}
        form={form}
      >
        <Form.Item name={"year"} label={t("period.year")} required>
          <InputNumber
            controls={false}
            minLength={4}
            min={2000}
            className="w-full"
            placeholder="2020"
          />
        </Form.Item>
        <Form.Item name={"description"} label={t("period.description")}>
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
              {id ? t("button.save") : t("button.add")}
            </Button>
            <Button
              htmlType="button"
              onClick={() => {
                form.resetFields();
                setId("");
              }}
            >
              {t("button.reset")}
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PeriodCreate;
