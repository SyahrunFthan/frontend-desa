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
import {
  outgoingStatusLetters,
  type OutgoingLetterModel,
} from "../../models/outgoingLetter";
import TextArea from "antd/es/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";
import { outgoingLetterUpdated } from "../../services/outgoingLetter";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  file: UploadFile[] | null;
  id: string;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  setFile: (file: UploadFile[] | null) => void;
  setId: (id: string) => void;
  fetchData: () => void;
}

const OutgoingLetterEdit = ({
  file,
  form,
  id,
  messageApi,
  notificationApi,
  openDrawer,
  setFile,
  setId,
  setOpenDrawer,
  fetchData,
}: Props) => {
  const { t } = useTranslation();
  const [processing, setProcessing] = useState(false);

  const handleChangeFile: UploadProps["onChange"] = ({ fileList }) => {
    setFile(fileList);
  };

  const handleSubmit: FormProps["onFinish"] = (values: OutgoingLetterModel) => {
    let formData = new FormData();
    formData.append("code", values.code ?? "");
    formData.append("date_of_letter", values.date_of_letter ?? "");
    formData.append("objective", values.objective ?? "");
    formData.append("regarding", values.regarding ?? "");
    formData.append("status_letter", values.status_letter ?? "");
    formData.append("summary", values.summary);

    if (file?.length && file[0]?.originFileObj) {
      formData.append("file", file[0].originFileObj);
    }

    outgoingLetterUpdated({
      data: formData,
      fetchData,
      form,
      id,
      messageApi,
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
      title={t("outgoingLetters.edit")}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item name={"code"} label={t("outgoingLetters.code")} required>
          <Input />
        </Form.Item>
        <Form.Item
          name={"date_of_letter"}
          label={t("outgoingLetters.dateOfLetter")}
          required
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          name={"objective"}
          label={t("outgoingLetters.objective")}
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"regarding"}
          label={t("outgoingLetters.regarding")}
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"status_letter"}
          label={t("outgoingLetters.statusLetter")}
          required
        >
          <Select placeholder="Select Status" options={outgoingStatusLetters} />
        </Form.Item>
        <Form.Item name={"summary"} label={t("outgoingLetters.summary")}>
          <TextArea />
        </Form.Item>
        <Form.Item
          name={"file"}
          label={t("outgoingLetters.chooseFile")}
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
                setId("");
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

export default OutgoingLetterEdit;
