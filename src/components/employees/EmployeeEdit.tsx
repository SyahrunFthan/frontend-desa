import {
  Button,
  DatePicker,
  Drawer,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  type FormInstance,
  type FormProps,
  type UploadFile,
  type UploadProps,
} from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { genders, positions, religions } from "../../models/global";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { employeeUpdated } from "../../services/employee";

interface Props {
  form: FormInstance;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  id: string;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  setId: (id: string) => void;
  fetchData: () => void;
  file: UploadFile[] | null;
  signature: UploadFile[] | null;
  setSignature: (signature: UploadFile[] | null) => void;
  setFile: (file: UploadFile[] | null) => void;
}

const EmployeeEdit = ({
  fetchData,
  form,
  id,
  messageApi,
  notificationApi,
  setId,
  openDrawer,
  setOpenDrawer,
  setFile,
  file,
  signature,
  setSignature,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const handleChangeFile: UploadProps["onChange"] = ({ fileList }) => {
    setFile(fileList);
  };

  const handleChangeSignature: UploadProps["onChange"] = ({ fileList }) => {
    setSignature(fileList);
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
    formData.append("id", id);

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

    if (signature?.length && signature[0]?.originFileObj) {
      formData.append("signature", signature[0].originFileObj);
    }

    employeeUpdated({
      data: formData,
      form,
      fetchData,
      id,
      messageApi,
      notificationApi,
      setId,
      setOpenDrawer,
      setProcessing,
    });
  };

  return (
    <Drawer title="Edit Employee" open={openDrawer} closable={false}>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
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
        <Form.Item name={"place_of_birth"} label="Place Of Birth" required>
          <Input placeholder="Ex: Palu" />
        </Form.Item>
        <Form.Item name={"date_of_birth"} label="Date Of Birth" required>
          <DatePicker />
        </Form.Item>
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
        <Form.Item name={"file"} label="Choose Signature">
          <Upload
            accept="image/*"
            beforeUpload={() => false}
            showUploadList
            listType="picture"
            multiple={false}
            maxCount={1}
            fileList={signature ?? []}
            onChange={handleChangeSignature}
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
                setSignature(null);
                setId("");
                setOpenDrawer(false);
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

export default EmployeeEdit;
