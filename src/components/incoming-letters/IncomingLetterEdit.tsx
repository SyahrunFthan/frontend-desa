import {
  Button,
  DatePicker,
  Drawer,
  Flex,
  Form,
  Input,
  Select,
  Upload,
  type FormInstance,
  type FormProps,
  type UploadFile,
  type UploadProps,
} from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { status_letters } from "../../models/incomingLetter";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { incomingLetterUpdated } from "../../services/incomingLetter";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  file: UploadFile[] | null;
  openDrawer: boolean;
  id: string;
  setFile: (file: UploadFile[] | null) => void;
  setOpenDrawer: (val: boolean) => void;
  setId: (id: string) => void;
  fetchData: () => void;
}

const IncomingLetterEdit = ({
  file,
  form,
  messageApi,
  notificationApi,
  openDrawer,
  setFile,
  setOpenDrawer,
  id,
  setId,
  fetchData,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const { t } = useTranslation();

  const handleChangeFile: UploadProps["onChange"] = ({ fileList }) => {
    setFile(fileList);
  };

  const handleSubmit: FormProps["onFinish"] = (values) => {
    let formData = new FormData();
    formData.append("code", values.code ?? "");
    formData.append("date_of_letter", values.date_of_letter ?? "");
    formData.append("date_of_receipt", values.date_of_receipt ?? "");
    formData.append("sender", values.sender ?? "");
    formData.append("regarding", values.regarding ?? "");
    formData.append("status_letter", values.status_letter ?? "");
    formData.append("id", id);
    formData.append("summary", values.summary);

    if (file?.length && file[0]?.originFileObj) {
      formData.append("file", file[0].originFileObj);
    }

    incomingLetterUpdated({
      data: formData,
      fetchData,
      form,
      messageApi,
      id,
      notificationApi,
      setFile,
      setId,
      setOpenDrawer,
      setProcessing,
    });
  };

  return (
    <Drawer
      open={openDrawer}
      closable={false}
      title={t("incoming letters.edit")}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label={t("incoming letters.code")} name={"code"} required>
          <Input />
        </Form.Item>
        <Form.Item
          label={t("incoming letters.date of letter")}
          name={"date_of_letter"}
          required
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          label={t("incoming letters.date of receipt")}
          name={"date_of_receipt"}
          required
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          label={t("incoming letters.sender")}
          name={"sender"}
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t("incoming letters.regarding")}
          name={"regarding"}
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"status_letter"}
          label={t("incoming letters.status letter")}
          required
        >
          <Select options={status_letters} />
        </Form.Item>

        <Form.Item
          name={"file"}
          label={t("incoming letters.choose file")}
          required
        >
          <Upload
            accept=".pdf"
            beforeUpload={() => false}
            showUploadList
            listType="picture"
            multiple={false}
            maxCount={1}
            fileList={file ?? []}
            onChange={handleChangeFile}
          >
            <Button icon={<UploadOutlined />}>Upload File</Button>
          </Upload>
        </Form.Item>
        <Form.Item label={t("incoming letters.summary")} name={"summary"}>
          <TextArea />
        </Form.Item>

        <Form.Item style={{ textAlign: "start" }}>
          <Flex gap="small">
            <Button
              loading={processing}
              type="primary"
              htmlType="submit"
              disabled={processing}
            >
              {t("button.save")}
            </Button>
            <Button
              htmlType="button"
              onClick={() => {
                form.resetFields();
                setFile(null);
                setOpenDrawer(false);
                setId;
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

export default IncomingLetterEdit;
