import { Button, Flex, Form, Input, type FormInstance } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { useState } from "react";
import { roleCreated, roleUpdated } from "../../services/role";

interface Props {
  form: FormInstance;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  id: string;
  setId: (id: string) => void;
  fetchData: () => void;
}

const RoleForm = ({
  form,
  messageApi,
  notificationApi,
  fetchData,
  id,
  setId,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  return (
    <Form
      layout="vertical"
      className="w-[100%] lg:w-[60%]"
      form={form}
      onFinish={(values) => {
        if (id !== "") {
          roleUpdated({
            data: values,
            fetchData,
            form,
            id,
            messageApi,
            notificationApi,
            setId,
            setProcessing,
          });
        } else {
          roleCreated({
            data: values,
            setProcessing,
            messageApi,
            notificationApi,
            fetchData,
            form,
          });
        }
      }}
    >
      <Form.Item name={"name"} label="Name" required>
        <Input placeholder="Ex: Admin" />
      </Form.Item>
      <Form.Item name={"key"} label="Role Key" required>
        <Input placeholder="Ex: admin" />
      </Form.Item>
      <Form.Item style={{ textAlign: "start" }}>
        <Flex gap="small">
          <Button
            loading={processing}
            type="primary"
            htmlType="submit"
            disabled={processing}
          >
            Add
          </Button>
          <Button
            htmlType="button"
            onClick={() => {
              form.resetFields();
              setId("");
            }}
          >
            Reset
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default RoleForm;
