import {
  Button,
  Card,
  DatePicker,
  Flex,
  Form,
  Input,
  Select,
  Switch,
  Typography,
  Upload,
  type UploadFile,
  type UploadProps,
} from "antd";
import { useState } from "react";
import { statusFamilies, type ResidentModel } from "../../models/resident";
import { residentCreated } from "../../services/resident";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { genders, religions, type Option } from "../../models/global";
import { UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  fetchResident: () => void;
  familyCardOptions: Option[];
}

const ResidentCreate = ({
  messageApi,
  notificationApi,
  fetchResident,
  familyCardOptions,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const [file, setFile] = useState<UploadFile[] | null>(null);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const handleChangeFile: UploadProps["onChange"] = ({ fileList }) => {
    setFile(fileList);
  };

  const handleSubmit = (values: Omit<ResidentModel, "id">) => {
    let formData = new FormData();

    formData.append("resident_id", values.resident_id || "");
    formData.append("fullname", values.fullname || "");
    formData.append("family_card_id", values.family_card_id || "");
    formData.append("gender", values.gender || "");
    formData.append("citizen_status", values.citizen_status || "");
    formData.append("family_status", values.family_status || "");
    formData.append("date_of_birth", values.date_of_birth || "");
    formData.append("place_of_birth", values.place_of_birth || "");
    formData.append("religion", values.religion || "");
    formData.append(
      "profesion_status",
      String(values?.profesion_status ?? false)
    );
    formData.append("address", values.address || "");

    if (values.profesion !== undefined) {
      formData.append("profesion", values.profesion);
    }

    if (file?.length && file[0].originFileObj) {
      formData.append("file", file[0].originFileObj);
    }

    residentCreated({
      form,
      formData,
      messageApi,
      notificationApi,
      setFile,
      setProcessing,
      fetchResident,
    });
  };

  return (
    <Card>
      <Typography.Title level={3}>Create Resident</Typography.Title>

      <Form
        layout="vertical"
        form={form}
        className="w-full lg:w-[25%]"
        onFinish={handleSubmit}
      >
        <Form.Item
          name={"resident_id"}
          label={t("residents.resident_id")}
          required
        >
          <Input maxLength={16} />
        </Form.Item>
        <Form.Item
          name={"family_card_id"}
          label={t("residents.family_id")}
          required
        >
          <Select
            options={familyCardOptions}
            showSearch
            filterOption={(input, option) => {
              return (option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase());
            }}
          />
        </Form.Item>
        <Form.Item
          name={"family_status"}
          label={t("residents.family_status")}
          required
        >
          <Select options={statusFamilies} />
        </Form.Item>
        <Form.Item name={"fullname"} label={t("residents.fullname")} required>
          <Input />
        </Form.Item>
        <Form.Item
          name={"place_of_birth"}
          label={t("residents.place_of_birth")}
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"date_of_birth"}
          label={t("residents.date_of_birth")}
          required
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          name={"citizen_status"}
          label={t("residents.citizen_status")}
          required
        >
          <Select
            options={[
              { label: "Citizen Local", value: "local citizen" },
              { label: "Mutation", value: "mutation" },
            ]}
          />
        </Form.Item>
        <Form.Item name={"gender"} label={t("residents.gender")} required>
          <Select options={genders} />
        </Form.Item>
        <Form.Item name={"religion"} label={t("residents.religion")} required>
          <Select options={religions} />
        </Form.Item>
        <Form.Item name={"address"} label={t("residents.address")} required>
          <TextArea />
        </Form.Item>
        <Form.Item name={"region_id"} label={t("residents.region")}>
          <Select />
        </Form.Item>
        <Form.Item name={"file"} label={t("residents.choose_image")}>
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
        <Form.Item
          name={"profesion_status"}
          label={t("residents.profession_status")}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          shouldUpdate={(prev, curr) =>
            prev.profesion_status !== curr.profesion_status
          }
          noStyle
        >
          {() =>
            form.getFieldValue("profesion_status") && (
              <Form.Item
                name="profesion"
                label={t("residents.profession")}
                rules={[{ required: true, message: "Please enter profession" }]}
              >
                <Input />
              </Form.Item>
            )
          }
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

export default ResidentCreate;
