import {
  Button,
  Drawer,
  Flex,
  Form,
  Input,
  Select,
  type FormInstance,
} from "antd";
import type { Option } from "../../models/global";
import { useState } from "react";
import { userUpdated } from "../../services/user";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";

interface Props {
  isOpen: boolean;
  form: FormInstance;
  roleOptions: Option[];
  residentOptions: Option[];
  id: string;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  setId: (id: string) => void;
  setIsOpen: (isOpen: boolean) => void;
  fetchData: () => void;
}

const UserEdit = ({
  isOpen,
  setIsOpen,
  form,
  roleOptions,
  id,
  setId,
  notificationApi,
  messageApi,
  fetchData,
  residentOptions,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  return (
    <Drawer open={isOpen} closable={false} title={`Edit User`}>
      <Form
        layout="vertical"
        form={form}
        onFinish={(values) => {
          const selfData = {
            email: values.email || "",
            username: values.username || "",
            role_id: values.role_id || "",
            id: id,
            resident_id: values.resident_id || "",
          };

          userUpdated({
            data: selfData,
            form,
            id,
            messageApi,
            notificationApi,
            setId,
            setIsOpen,
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
                setIsOpen(false);
                setId("");
              }}
            >
              Back
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default UserEdit;
