import {
  Button,
  ColorPicker,
  Drawer,
  Flex,
  Form,
  Input,
  Select,
  Upload,
  type FormInstance,
  type UploadFile,
  type UploadProps,
} from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { TFunction } from "i18next";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { Option } from "../../models/global";
import { UploadOutlined } from "@ant-design/icons";
import type { RegionModel } from "../../models/region";
import { processFail } from "../../helpers/process";
import { geojsonAreaKm2 } from "../../helpers/area";
import { regionUpdated } from "../../services/region";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  form: FormInstance;
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  openDrawer: boolean;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  t: TFunction;
  optionLeader: Option[];
  regions: RegionModel[];
  fetchData: () => void;
}

const RegionEdit = ({
  fetchData,
  form,
  id,
  messageApi,
  notificationApi,
  openDrawer,
  setId,
  setOpenDrawer,
  t,
  optionLeader,
}: Props) => {
  const [file, setFile] = useState<UploadFile[] | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleChangeFile: UploadProps["onChange"] = async ({ fileList }) => {
    const file = fileList[0]?.originFileObj;

    if (file) {
      const text = await file.text();

      try {
        const geoJson = JSON.parse(text);

        if (
          !geoJson ||
          (geoJson.type !== "FeatureCollection" &&
            geoJson.type !== "GeometryCollection")
        ) {
          processFail(messageApi, "uploadFile", "Type of file is not valid");
          return;
        }

        const landAreaKm2 = geojsonAreaKm2(geoJson);

        form.setFieldsValue({
          geo_json: JSON.stringify(geoJson),
          land_area: `${landAreaKm2.toFixed(2)} Km2`,
        });
        setFile(fileList);
      } catch (error) {
        processFail(messageApi, "uploadFile", "File bermasalah");
      }
    }
  };

  return (
    <Drawer open={openDrawer} closable={false} title={t("region.edit")}>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          const data: Omit<RegionModel, "leader"> = {
            color: values.color || "",
            name: values.name || "",
            geo_json: values.geo_json || "",
            land_area: values.land_area || "",
            leader_id: values.leader_id || "",
            id: id,
          };

          regionUpdated({
            data,
            fetchData,
            form,
            notificationApi,
            setProcessing,
            id,
            messageApi,
            setId,
            setOpenDrawer,
          });
          setFile(null);
        }}
      >
        <Form.Item name={"name"} label={t("region.name")} required>
          <Input />
        </Form.Item>
        <Form.Item name={"leader_id"} label={t("region.leader")} required>
          <Select options={optionLeader} />
        </Form.Item>

        <Form.Item name={"land_area"} label={t("region.land_area")} required>
          <Input disabled />
        </Form.Item>

        <Form.Item
          name={"color"}
          initialValue={"#fffe42"}
          label={t("region.color")}
          required
        >
          <ColorPicker
            onChange={(_, hex) => form.setFieldsValue({ color: hex })}
            showText
          />
        </Form.Item>

        <Form.Item name={"geo_json"} label={t("region.geo_json")} required>
          <Input.TextArea disabled />
        </Form.Item>

        <Form.Item name={"file"} label={t("region.geo_json")}>
          <Upload
            accept=".json, .geojson"
            beforeUpload={() => false}
            showUploadList
            listType="picture"
            multiple={false}
            maxCount={1}
            fileList={file ?? []}
            onChange={handleChangeFile}
            onRemove={() => {
              setFile(null);
              form.setFieldsValue({ geo_json: "", land_area: "" });
            }}
          >
            <Button icon={<UploadOutlined />}>Upload File</Button>
          </Upload>
        </Form.Item>

        <Form.Item style={{ textAlign: "start", marginTop: 20 }}>
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

export default RegionEdit;
