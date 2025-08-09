import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Typography,
} from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { TFunction } from "i18next";
import { useMemo, useState } from "react";
import type { IncomeOption, Option } from "../../models/global";
import { expenseCreated } from "../../services/expense";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  t: TFunction;
  incomes: IncomeOption[];
  periods: Option[];
  fetchData: () => void;
}

const ExpenseCreate = ({
  fetchData,
  messageApi,
  notificationApi,
  incomes,
  periods,
  t,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm();

  const periodId = Form.useWatch("period_id", form);

  const fundingOptions = useMemo(() => {
    if (!periodId) return [];
    return incomes
      .filter((i) => i.period_id === periodId)
      .map((i) => ({ value: i.value, label: i.label }));
  }, [periodId, incomes]);

  return (
    <Card>
      <Typography.Title level={3}>
        {t("expense.createOfExpense")}
      </Typography.Title>

      <Form
        layout="vertical"
        form={form}
        className="w-full lg:w-[30%]"
        onFinish={(values) => {
          const data = {
            period_id: values.period_id || "",
            code: values.code || "",
            name: values.name || "",
            is_main: values.is_main || false,
            funding_source_id: values.funding_source_id || "",
            volume: Number(values.volume) || 0,
            unit: Number(values.unit) || 0,
            amount: Number(values.amount) || 0,
          };

          expenseCreated({
            data,
            fetchData,
            form,
            messageApi,
            notificationApi,
            setProcessing,
          });
        }}
      >
        <Form.Item name={"code"} label={t("expense.code")} required>
          <Input />
        </Form.Item>
        <Form.Item name={"name"} label={t("expense.name")} required>
          <Input />
        </Form.Item>
        <Form.Item name={"period_id"} label={t("expense.period")} required>
          <Select
            options={periods}
            onChange={() =>
              form.setFieldsValue({ funding_source_id: undefined })
            }
          />
        </Form.Item>
        <Form.Item
          name={"funding_source_id"}
          label={t("expense.funding_source_id")}
          required
        >
          <Select options={fundingOptions} disabled={!periodId} />
        </Form.Item>
        <Form.Item
          name={"is_main"}
          label={t("expense.is_main")}
          valuePropName="checked"
        >
          <Switch defaultChecked={false} />
        </Form.Item>
        <Form.Item
          shouldUpdate={(prev, curr) => prev.is_main !== curr.is_main}
          noStyle
        >
          {() =>
            form.getFieldValue("is_main") && (
              <>
                <Form.Item name={"volume"} label={t("expense.volume")} required>
                  <InputNumber controls={false} className="w-full" />
                </Form.Item>
                <Form.Item name={"unit"} label={t("expense.unit")} required>
                  <InputNumber min={1} />
                </Form.Item>
                <Form.Item name={"amount"} label={t("expense.amount")} required>
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
              </>
            )
          }
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

export default ExpenseCreate;
