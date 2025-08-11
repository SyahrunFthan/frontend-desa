import {
  Button,
  Flex,
  Form,
  Input,
  type FormInstance,
  type FormProps,
} from "antd";
import type { TFunction } from "i18next";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { RWUnitModel } from "../../models/rwUnit";
import { rwUnitCreated, rwUnitUpdated } from "../../services/rwUnit";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";

interface Props {
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  t: TFunction;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  fetchData: () => void;
}

const RWUnitForm = ({
  id,
  setId,
  t,
  form,
  fetchData,
  messageApi,
  notificationApi,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const handleUpdate: FormProps["onFinish"] = (values) => {
    const data: RWUnitModel = {
      id: id || "",
      code: values.code || "",
      name_of_chairman: values.name_of_chairman || "",
    };

    rwUnitUpdated({
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
    const data: Omit<RWUnitModel, "id"> = {
      code: values.code || "",
      name_of_chairman: values.name_of_chairman || "",
    };

    rwUnitCreated({
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
      className="w-full lg:w-[70%]"
      onFinish={id ? handleUpdate : handleCreate}
    >
      <Form.Item name={"code"} label={t("rw.code")} required>
        <Input className="w-full" placeholder="Ex: 001" />
      </Form.Item>
      <Form.Item
        name={"name_of_chairman"}
        label={t("rw.name_of_chairman")}
        required
      >
        <Input />
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

export default RWUnitForm;
