import {
  Button,
  Drawer,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  type FormInstance,
} from "antd";
import type { TFunction } from "i18next";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { Option } from "../../models/global";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { incomeUpdated } from "../../services/income";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  t: TFunction;
  form: FormInstance;
  periods: Option[];
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  fetchData: () => void;
}

const IncomeEdit = ({
  isOpen,
  setIsOpen,
  t,
  form,
  periods,
  fetchData,
  messageApi,
  notificationApi,
  id,
  setId,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  return (
    <Drawer open={isOpen} closable={false} title={t("incomes.edit")}>
      <Form
        layout="vertical"
        form={form}
        onFinish={(values) => {
          const data = {
            period_id: values.period_id || "",
            amount: values.amount || 0,
            code: values.code || "",
            name: values.name || "",
            abbreviation: values.abbreviation || "",
            id: id,
          };

          incomeUpdated({
            data,
            fetchData,
            form,
            id,
            messageApi,
            notificationApi,
            setId,
            setProcessing,
            setIsOpen,
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
            <Button
              htmlType="reset"
              disabled={processing}
              loading={processing}
              onClick={() => {
                form.resetFields();
                setIsOpen(false);
                setId("");
              }}
            >
              {t("button.back")}
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default IncomeEdit;
