import {
  Button,
  Flex,
  Form,
  Input,
  Select,
  type FormInstance,
  type FormProps,
} from "antd";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { Option } from "../../models/global";
import type { TFunction } from "i18next";
import type { RTUnitModel } from "../../models/rtUnit";
import { rtUnitCreated, rtUnitUpdated } from "../../services/rtUnit";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";

interface Props {
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  optionCitizen: Option[];
  t: TFunction;
  form: FormInstance;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  fetchData: () => void;
}

const RTUnitForm = ({
  id,
  optionCitizen,
  setId,
  t,
  form,
  messageApi,
  notificationApi,
  fetchData,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const handleUpdate: FormProps["onFinish"] = (values) => {
    const data: RTUnitModel = {
      code: values.code || "",
      name_of_chairman: values.name_of_chairman || "",
      rw_id: values.rw_id || "",
      id: id || "",
    };

    rtUnitUpdated({
      data,
      fetchData,
      form,
      id,
      messageApi,
      notificationApi,
      setId,
      setProcessing,
    });
  };

  const handleCreate: FormProps["onFinish"] = (values) => {
    const data: Omit<RTUnitModel, "id"> = {
      code: values.code || "",
      name_of_chairman: values.name_of_chairman || "",
      rw_id: values.rw_id || "",
    };

    rtUnitCreated({
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
      layout="vertical"
      form={form}
      className="w-full lg:w-[60%]"
      onFinish={id ? handleUpdate : handleCreate}
    >
      <Form.Item name={"code"} label={t("rt.code")} required>
        <Input placeholder="Ex: 001" />
      </Form.Item>
      <Form.Item
        name={"name_of_chairman"}
        label={t("rt.name_of_chairman")}
        required
      >
        <Input />
      </Form.Item>
      <Form.Item name={"rw_id"} label={t("rt.rw_id")} required>
        <Select options={optionCitizen} />
      </Form.Item>
      <Form.Item>
        <Flex gap={"middle"}>
          <Button
            type="primary"
            htmlType="submit"
            loading={processing}
            disabled={processing}
          >
            {t("button.save")}
          </Button>
          <Button
            htmlType="reset"
            onClick={() => {
              form.resetFields();
              setId("");
            }}
            loading={processing}
            disabled={processing}
          >
            {t("button.reset")}
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default RTUnitForm;
