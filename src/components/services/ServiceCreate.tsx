import {
  Button,
  Flex,
  Form,
  Input,
  Select,
  Upload,
  type FormProps,
  type UploadFile,
} from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { TFunction } from "i18next";
import { useState } from "react";
import { typeServices, type ServiceModel } from "../../models/service";
import { status } from "../../models/global";
import { UploadOutlined } from "@ant-design/icons";
import { serviceCreated } from "../../services/service";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  t: TFunction;
  fetchData: () => void;
}

const ServiceCreate = ({
  fetchData,
  messageApi,
  notificationApi,
  t,
}: Props) => {
  const [file, setFile] = useState<UploadFile[] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm<Omit<ServiceModel, "id" | "template_file">>();

  const handleSubmit: FormProps["onFinish"] = (values) => {
    let formData = new FormData();

    formData.append("name", values.name ?? "");
    formData.append("type_service", values.type_service ?? "");
    formData.append("status_service", values.status_service ?? "");

    if (file?.length && file[0]?.originFileObj) {
      formData.append("file", file[0].originFileObj);
    }

    serviceCreated({
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
    <Form
      layout="vertical"
      form={form}
      className="w-full lg:w-[60%]"
      onFinish={handleSubmit}
    >
      <Form.Item required name={"name"} label={t("service.name")}>
        <Input />
      </Form.Item>
      <Form.Item
        required
        name={"type_service"}
        label={t("service.type_service")}
      >
        <Select options={typeServices} />
      </Form.Item>
      <Form.Item
        required
        name={"status_service"}
        label={t("service.status_service")}
      >
        <Select options={status} />
      </Form.Item>
      <Form.Item name={"file"} label={"Upload File"} required>
        <Upload
          fileList={file ?? []}
          beforeUpload={() => false}
          accept=".pdf, .docx"
          multiple={false}
          maxCount={1}
          showUploadList
          listType="picture"
          onChange={({ fileList }) => {
            setFile(fileList);
          }}
        >
          <Button icon={<UploadOutlined />}>Upload File</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Flex gap={"small"}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={processing}
            loading={processing}
          >
            {t("button.add")}
          </Button>
          <Button
            htmlType="reset"
            onClick={() => {
              form.resetFields();
              setFile(null);
            }}
          >
            {t("button.reset")}
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default ServiceCreate;
