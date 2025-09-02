import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Form,
  Input,
  Upload,
  type FormProps,
  type UploadFile,
} from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { TFunction } from "i18next";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  stallCategoryCreated,
  stallCategoryUpdated,
} from "../../services/stallCategory";
import type { StallCategoryModel } from "../../models/stallCategory";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  t: TFunction;
  record: StallCategoryModel | null;
  setRecord: Dispatch<SetStateAction<StallCategoryModel | null>>;
  fetchData: () => void;
}

const StallCategoryForm = (params: Props) => {
  const { messageApi, notificationApi, t, fetchData, record, setRecord } =
    params;

  const [file, setFile] = useState<UploadFile[] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit: FormProps["onFinish"] = (values) => {
    let formData = new FormData();
    formData.append("name", values.name ?? "");

    if (file?.length && file[0].originFileObj) {
      formData.append("file", file[0].originFileObj);
    }

    stallCategoryCreated({
      data: formData,
      messageApi,
      notificationApi,
      form,
      setProcessing,
      setFile,
      fetchData,
    });
  };

  const handleUpdate: FormProps["onFinish"] = (values) => {
    let formData = new FormData();
    formData.append("name", values.name ?? "");

    if (file?.length && file[0].originFileObj) {
      formData.append("file", file[0].originFileObj);
    }

    stallCategoryUpdated({
      data: formData,
      id: record?.id ?? "",
      messageApi,
      notificationApi,
      form,
      setProcessing,
      setFile,
      setRecord,
      fetchData,
    });
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
      setFile([
        {
          uid: record.id,
          name: record.icon_file,
          url: record.icon_path,
          status: "done",
        },
      ]);
    }
  }, [record]);

  return (
    <Form
      layout="vertical"
      form={form}
      className="w-full lg:w-[75%]"
      onFinish={record ? handleUpdate : handleSubmit}
    >
      <Form.Item label={t("stall_category.name")} name="name" required={true}>
        <Input />
      </Form.Item>
      <Form.Item label={t("stall_category.choose_icon")} name="file">
        <Upload
          accept="image/*"
          fileList={file ?? []}
          maxCount={1}
          multiple={false}
          beforeUpload={() => false}
          showUploadList
          listType="picture"
          onChange={(info) => {
            setFile(info.fileList);
          }}
        >
          <Button icon={<UploadOutlined />}>Upload Icon</Button>
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
              setRecord(null);
            }}
          >
            {record ? t("button.back") : t("button.reset")}
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default StallCategoryForm;
