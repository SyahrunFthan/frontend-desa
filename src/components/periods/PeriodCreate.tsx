import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Form,
  InputNumber,
  Typography,
  Upload,
  type FormProps,
  type UploadFile,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { PeriodModel } from "../../models/period";
import { periodCreated } from "../../services/period";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  fetchData: () => void;
}

const PeriodCreate = ({ fetchData, messageApi, notificationApi }: Props) => {
  const [file, setFile] = useState<UploadFile[] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const handleSubmit: FormProps["onFinish"] = (values: PeriodModel) => {
    let formData = new FormData();

    formData.append("year", (values.year ?? 0).toString());
    if (values.description) {
      formData.append("description", values.description);
    }
    if (file?.length && file[0]?.originFileObj) {
      formData.append("file", file[0].originFileObj);
    }

    formData.forEach((r) => console.log(r));

    periodCreated({
      data: formData,
      fetchData,
      form,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  return (
    <div className="w-full">
      <Form
        className="w-full lg:w-[40%]"
        layout="vertical"
        onFinish={handleSubmit}
        form={form}
      >
        <Form.Item name={"year"} label={t("period.year")} required>
          <InputNumber
            controls={false}
            minLength={4}
            min={2020}
            className="w-full"
            placeholder="2020"
          />
        </Form.Item>
        <Form.Item name={"description"} label={t("period.description")}>
          <TextArea />
        </Form.Item>
        <Form.Item name={"file"} label={t("period.chooseFile")}>
          <Upload
            accept=".pdf"
            beforeUpload={() => false}
            showUploadList
            listType="picture"
            multiple={false}
            maxCount={1}
            fileList={file ?? []}
          >
            <Flex vertical>
              <Button icon={<UploadOutlined />}>Upload File</Button>
              <Typography.Text className="italic text-gray-400">
                Max file 2MB (.pdf)
              </Typography.Text>
            </Flex>
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
              {t("button.add")}
            </Button>
            <Button
              htmlType="button"
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
    </div>
  );
};

export default PeriodCreate;
