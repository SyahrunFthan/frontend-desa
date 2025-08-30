import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  Select,
  Typography,
  type FormInstance,
} from "antd";
import type { Option } from "../../models/global";
import { useState } from "react";
import { userCreated } from "../../services/user";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";

interface Props {
  roleOptions: Option[];
  residentOptions: Option[];
  form: FormInstance;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  fetchData: () => void;
}

const UserCreate = ({
  roleOptions,
  form,
  messageApi,
  notificationApi,
  fetchData,
  residentOptions,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  return (
    <Card>
      <Typography.Title level={3}>Create User</Typography.Title>
      <Form
        layout="vertical"
        className="w-full lg:w-[30%]"
        form={form}
        onFinish={(values) => {
          const selfData = {
            email: values.email || "",
            username: values.username || "",
            role_id: values.role_id || "",
            resident_id: values.resident_id || "",
          };
          userCreated({
            data: selfData,
            form,
            messageApi,
            notificationApi,
            setProcessing,
            fetchData,
          });
        }}
      >
        <Form.Item name={"email"} label="Email:" required>
          <Input placeholder="Ex: johndoe@example.com" />
        </Form.Item>
        <Form.Item
          name={"username"}
          label="Username:"
          required
          rules={[
            {
              pattern: /^[0-9]+$/,
              message: "Username hanya boleh berupa angka",
            },
          ]}
        >
          <Input placeholder="Ex: 028312" />
        </Form.Item>
        <Form.Item name={"role_id"} label="Role ID:" required>
          <Select options={roleOptions} />
        </Form.Item>
        <Form.Item name={"resident_id"} label="Resident ID:" required>
          <Select
            options={residentOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
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
              Save
            </Button>
            <Button
              htmlType="button"
              onClick={() => {
                form.resetFields();
              }}
            >
              Reset
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UserCreate;
