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
  type FormProps,
  type UploadFile,
  type UploadProps,
} from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { genders, positions, religions } from "../../models/global";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { employeeUpdated } from "../../services/employee";
import { employeeState, type EmployeeModel } from "../../models/employee";
import dayjs from "dayjs";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  openDrawer: boolean;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  record: EmployeeModel;
  setRecord: Dispatch<SetStateAction<EmployeeModel>>;
  fetchData: () => void;
}

const EmployeeEdit = ({
  fetchData,
  messageApi,
  notificationApi,
  openDrawer,
  setOpenDrawer,
  record,
  setRecord,
}: Props) => {
  const [file, setFile] = useState<UploadFile[] | null>(null);
  const [signature, setSignature] = useState<UploadFile[] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm();
  const isStructure = Form.useWatch("is_structure", form);

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
    formData.append("id", record.id);

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
      id: record.id,
      form,
      fetchData,
      messageApi,
      notificationApi,
      setOpenDrawer,
      setFile,
      setProcessing,
      setRecord,
    });
  };

  useEffect(() => {
    if (isStructure) {
      form.setFieldsValue({ position: "" });
    }

    if (isStructure && record.level == 0) {
      form.setFieldsValue({ position: record.position });
    }
  }, [isStructure]);

  useEffect(() => {
    form.setFieldsValue({
      ...record,
      ...(record.level !== 0
        ? {
            position_official: {
              value: record.level,
              label: record.position,
            },
          }
        : {}),
      date_of_birth: dayjs(record.date_of_birth, "YYYY-MM-DD"),
    });

    setFile(
      record.image
        ? [
            {
              uid: record.id,
              name: record.image,
              url: record.path_image,
            } as UploadFile,
          ]
        : null
    );

    setSignature(
      record.signature_file
        ? [
            {
              uid: record.id,
              name: record.signature_file,
              url: record.signature_path,
            } as UploadFile,
          ]
        : null
    );
  }, [record, form]);

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
          <DatePicker className="w-full" />
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
        <Form.Item name={"signature"} label="Choose Signature">
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
                setRecord(employeeState);
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
