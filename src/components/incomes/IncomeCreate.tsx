import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
} from "antd";
import type { TFunction } from "i18next";
import type { Option } from "../../models/global";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { incomeCreated } from "../../services/income";
import { useState } from "react";

interface Props {
  t: TFunction;
  periods: Option[];
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  fetchData: () => void;
}

const IncomeCreate = ({
  t,
  periods,
  messageApi,
  notificationApi,
  fetchData,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm();

  return (
    <Card>
      <Typography.Title level={3}>
        {t("incomes.createOfIncome")}
      </Typography.Title>

      <Form
        layout="vertical"
        form={form}
        className="w-full lg:w-[30%]"
        onFinish={(values) => {
          const data = {
            period_id: values.period_id || "",
            amount: values.amount || 0,
            code: values.code || "",
            name: values.name || "",
            abbreviation: values.abbreviation || "",
          };

          incomeCreated({
            data,
            fetchData,
            form,
            messageApi,
            notificationApi,
            setProcessing,
          });
        }}
      >
        <Form.Item name={"code"} label={t("incomes.code")} required>
          <Input />
        </Form.Item>
        <Form.Item name={"name"} label={t("incomes.name")} required>
          <Input />
        </Form.Item>
        <Form.Item
          name={"abbreviation"}
          label={t("incomes.abbreviation")}
          required
        >
          <Input />
        </Form.Item>
        <Form.Item name={"amount"} label={t("incomes.amount")} required>
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
        <Form.Item name={"period_id"} label={t("incomes.period_id")} required>
          <Select options={periods} />
        </Form.Item>
        <Form.Item>
          <Flex gap={"middle"}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={processing}
              loading={processing}
            >
              {t("button.save")}
            </Button>
            <Button htmlType="reset" disabled={processing} loading={processing}>
              {t("button.reset")}
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default IncomeCreate;
