import { DeleteOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Popover, Tooltip } from "antd";
import type { FormInstance } from "antd/lib";
import { useState } from "react";

interface Props {
  id: string;
  processing: boolean;
  form: FormInstance;
  handleReject: (id: string, note: string) => void;
}

const RejectPopover = ({ handleReject, id, form, processing }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      title={`Konfirmasi Penolakan`}
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      content={
        <Form
          layout="vertical"
          onFinish={({ note }) => handleReject(id, note)}
          form={form}
        >
          <Form.Item name={"note"} rules={[{ required: true }]} label="Alasan">
            <Input.TextArea
              rows={3}
              placeholder="Tulis alasan penolakan untuk"
            />
          </Form.Item>
          <Form.Item className="flex justify-end space-x-2">
            <Flex gap={"small"}>
              <Button
                size="small"
                htmlType="reset"
                onClick={() => {
                  form.resetFields();
                  setOpen(false);
                }}
                disabled={processing}
                loading={processing}
              >
                Batal
              </Button>
              <Button
                size="small"
                type="primary"
                htmlType="submit"
                disabled={processing}
                loading={processing}
              >
                Kirim
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      }
    >
      <Tooltip title="Tolak">
        <Button
          htmlType="button"
          type="text"
          className="cursor-pointer text-red-600 hover:!text-red-800"
          disabled={processing}
          loading={processing}
        >
          <DeleteOutlined className="text-lg" />
        </Button>
      </Tooltip>
    </Popover>
  );
};

export default RejectPopover;
