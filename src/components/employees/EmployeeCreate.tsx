import {
  Button,
  Card,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Switch,
  Typography,
  Upload,
  type FormProps,
  type UploadFile,
  type UploadProps,
} from "antd";
import { useState } from "react";
import { genders, positions, religions } from "../../models/global";
import { UploadOutlined } from "@ant-design/icons";
import { employeeCreated } from "../../services/employee";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  fetchData: () => void;
}

const EmployeeCreate = ({ messageApi, notificationApi, fetchData }: Props) => {
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [file, setFile] = useState<UploadFile[] | null>(null);

  const handleChangeFile: UploadProps["onChange"] = ({ fileList }) => {
    setFile(fileList);
  };

  const handleSubmit: FormProps["onFinish"] = (values) => {
    let formData = new FormData();
    formData.append("employee_id", values.employee_id ?? "");
    formData.append("fullname", values.fullname ?? "");
    formData.append("gender", values.gender ?? "");
    formData.append("religion", values.religion ?? "");
    formData.append("place_of_birth", values.place_of_birth ?? "");
    formData.append("date_of_birth", values.date_of_birth ?? "");
    formData.append("is_structure", String(values.is_structure ?? false));

    const level =
      values.is_structure && values.position_official
        ? String(values.position_official.value)
        : "0";
    formData.append("level", level);
    formData.append(
      "position",
      level == "0" ? values.position ?? "" : values.position_official.label
    );

    if (file?.length && file[0]?.originFileObj) {
      formData.append("file", file[0].originFileObj);
    }

    employeeCreated({
      data: formData,
      fetchData,
      form,
      messageApi,
      notificationApi,
      setProcessing,
      setFile,
    });
  };

  return (
    <Card>
      <Typography.Title level={3}>Create Employee</Typography.Title>

      <Form
        layout="vertical"
        form={form}
        className="w-full lg:w-[30%]"
        onFinish={handleSubmit}
      >
        <Form.Item name={"employee_id"} label="ID Employee" required>
          <InputNumber
            controls={false}
            className="w-full"
            placeholder="Ex: 7270xxxx"
            maxLength={16}
          />
        </Form.Item>
        <Form.Item name={"fullname"} label="Full Name" required>
          <Input placeholder="Ex: John Doe" />
        </Form.Item>
        <Form.Item name={"gender"} label="Gender" required>
          <Select options={genders} placeholder="Select Gender" />
        </Form.Item>
        <Form.Item name={"religion"} label="Religion" required>
          <Select options={religions} placeholder="Select Religion" />
        </Form.Item>
        <Flex>
          <Space size={"middle"}>
            <Form.Item name={"place_of_birth"} label="Place Of Birth" required>
              <Input placeholder="Ex: Palu" />
            </Form.Item>
            <Form.Item name={"date_of_birth"} label="Date Of Birth" required>
              <DatePicker />
            </Form.Item>
          </Space>
        </Flex>
        <Form.Item
          name={"is_structure"}
          label="Village Officials?"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          shouldUpdate={(prev, curr) => prev.is_structure !== curr.is_structure}
          noStyle
        >
          {() =>
            form.getFieldValue("is_structure") ? (
              <Form.Item name={"position_official"} label="Position" required>
                <Select
                  placeholder="Select Position"
                  options={positions}
                  labelInValue
                />
              </Form.Item>
            ) : (
              <Form.Item name={"position"} label="Position" required>
                <Input placeholder="Ex: Kepala Dusun" />
              </Form.Item>
            )
          }
        </Form.Item>
        <Form.Item name={"file"} label="Choose Image">
          <Upload
            accept="image/*"
            beforeUpload={() => false}
            showUploadList
            listType="picture"
            multiple={false}
            maxCount={1}
            fileList={file ?? []}
            onChange={handleChangeFile}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
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
                setFile(null);
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

export default EmployeeCreate;
