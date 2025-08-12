import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { typeServices, type ServiceModel } from "../../models/service";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  Button,
  Drawer,
  Flex,
  Form,
  Input,
  Select,
  Upload,
  type FormProps,
  type UploadFile,
} from "antd";
import type { TFunction } from "i18next";
import { status } from "../../models/global";
import { UploadOutlined } from "@ant-design/icons";
import { serviceUpdated } from "../../services/service";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  record: ServiceModel;
  setRecord: Dispatch<SetStateAction<ServiceModel>>;
  openDrawer: boolean;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  t: TFunction;
  fetchData: () => void;
}

const ServiceEdit = ({
  fetchData,
  id,
  messageApi,
  notificationApi,
  openDrawer,
  record,
  setId,
  setOpenDrawer,
  setRecord,
  t,
}: Props) => {
  const [file, setFile] = useState<UploadFile[] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm<Omit<ServiceModel, "id" | "template_path">>();

  const handleSubmit: FormProps["onFinish"] = (values) => {
    let formData = new FormData();

    formData.append("name", values.name ?? "");
    formData.append("type_service", values.type_service ?? "");
    formData.append("status_service", values.status_service ?? "");
    formData.append("id", id ?? "");

    if (file?.length && file[0]?.originFileObj) {
      formData.append("file", file[0].originFileObj);
    }

    serviceUpdated({
      data: formData,
      fetchData,
      form,
      messageApi,
      notificationApi,
      setProcessing,
      setFile,
      id,
      setId,
      setOpenDrawer,
      setRecord,
    });
  };

  useEffect(() => {
    setFile([
      {
        uid: id,
        name: record.template_file,
        url: record.template_path,
      },
    ]);
    form.setFieldsValue(record);
  }, [record, id]);

  return (
    <Drawer open={openDrawer} closable={false} title={t("service.edit")}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
              {t("button.save")}
            </Button>
            <Button
              htmlType="reset"
              onClick={() => {
                form.resetFields();
                setFile(null);
                setId("");
                setRecord({
                  id: "",
                  name: "",
                  status_service: "",
                  template_file: "",
                  template_path: "",
                  type_service: "",
                });
                setOpenDrawer(false);
              }}
            >
              {t("button.back")}
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ServiceEdit;
