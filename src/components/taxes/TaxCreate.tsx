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
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { TFunction } from "i18next";
import { useState } from "react";
import type { Option } from "../../models/global";
import { status_payments } from "../../models/tax";
import { taxCreated } from "../../services/tax";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  t: TFunction;
  optionResident: Option[];
  fetchData: () => void;
}

const TaxCreate = ({
  fetchData,
  messageApi,
  notificationApi,
  t,
  optionResident,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm();

  return (
    <Card>
      <Typography.Title level={3}>{t("tax.createOfTax")}</Typography.Title>

      <Form
        layout="vertical"
        form={form}
        className="w-full lg:w-[30%]"
        onFinish={(values) => {
          const data = {
            reference_number: values.reference_number ?? "",
            resident_id: values.resident_id ?? "",
            taxpayer_name: values.taxpayer_name ?? "",
            taxpayer_address: values.taxpayer_address ?? "",
            land_area: values.land_area ?? 0,
            building_area: values.building_area ?? 0,
            amount: values.amount ?? 0,
            status: values.status ?? "",
          };

          taxCreated({
            data,
            fetchData,
            messageApi,
            form,
            notificationApi,
            setProcessing,
          });
        }}
      >
        <Form.Item
          name={"reference_number"}
          label={t("tax.reference_number")}
          required
        >
          <Input />
        </Form.Item>
        <Form.Item name={"resident_id"} label={t("tax.resident_id")} required>
          <Select
            showSearch
            options={optionResident}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item
          name={"taxpayer_name"}
          label={t("tax.taxpayer_name")}
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"taxpayer_address"}
          label={t("tax.taxpayer_address")}
          required
        >
          <Input />
        </Form.Item>
        <Flex gap={"middle"}>
          <Form.Item
            name={"land_area"}
            label={t("tax.land_area")}
            className="w-full"
            required
          >
            <InputNumber className="w-full" min={1} />
          </Form.Item>
          <Form.Item
            name={"building_area"}
            label={t("tax.building_area")}
            required
            className="w-full"
          >
            <InputNumber className="w-full" min={1} />
          </Form.Item>
        </Flex>
        <Form.Item name={"amount"} label={t("tax.amount")} required>
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
        <Form.Item name={"status"} label={t("tax.status")} required>
          <Select options={status_payments} />
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

export default TaxCreate;
