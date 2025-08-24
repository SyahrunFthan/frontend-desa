import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  developmentState,
  statusWorks,
  type DevelopmentModel,
} from "../../models/development";
import type { TFunction } from "i18next";
import dayjs from "dayjs";
import MapView from "../maps/MapView";
import { Marker } from "react-leaflet";
import { developmentUpdated } from "../../services/development";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import DrawControl from "../maps/DrawControl";
import AutoCenter from "../maps/AutoCenter";

interface Props {
  record: DevelopmentModel;
  setRecord: Dispatch<SetStateAction<DevelopmentModel>>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  t: TFunction;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  fetchData: () => void;
}

const DevelopmentEdit = ({
  record,
  setOpenDrawer,
  setRecord,
  t,
  messageApi,
  notificationApi,
  fetchData,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm();
  const lat = Form.useWatch("latitude", form);
  const lng = Form.useWatch("longitude", form);
  const [location, setLocation] = useState({
    latitude: lat,
    longitude: lng,
  });

  useEffect(() => {
    form.setFieldsValue({
      ...record,
      start_at: dayjs(record.start_at, "YYYY-MM-DD"),
      end_at: dayjs(record.end_at, "YYYY-MM-DD"),
    });
    setLocation({
      latitude: record.latitude,
      longitude: record.longitude,
    });
  }, [record]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        const data = {
          name: values.name ?? "",
          location: values.location ?? "",
          latitude: values.latitude ?? 95,
          longitude: values.longitude ?? 185,
          volume: values.volume ?? "",
          budget: values.budget ?? 0,
          source_of_fund: values.source_of_fund ?? "",
          year: values.year ?? 0,
          start_at: values.start_at ?? "",
          end_at: values.end_at ?? "",
          status: values.status ?? "",
        };

        developmentUpdated({
          id: record.id,
          data,
          fetchData,
          form,
          messageApi,
          notificationApi,
          setOpenDrawer,
          setProcessing,
          setRecord,
        });
      }}
    >
      <Form.Item name={"name"} label={t("development.name")} required>
        <Input />
      </Form.Item>
      <Form.Item name={"location"} label={t("development.location")} required>
        <Input />
      </Form.Item>
      <MapView>
        <AutoCenter
          lat={form.getFieldValue("latitude") ?? Number(location?.latitude)}
          lng={form.getFieldValue("longitude") ?? Number(location?.longitude)}
          zoom={17}
        />

        <DrawControl
          latitude={Number(location?.latitude)}
          longitude={Number(location?.longitude)}
          setLatitude={(value) => {
            setLocation((prev) => ({
              ...prev,
              latitude: value,
            }));
            form.setFieldsValue({ latitude: value });
          }}
          setLongitude={(value) => {
            setLocation((prev) => ({
              ...prev,
              longitude: value,
            }));
            form.setFieldsValue({ longitude: value });
          }}
        />

        {location.latitude !== 0 && (
          <Marker position={[location.latitude, location.longitude]} />
        )}
      </MapView>
      <Form.Item
        name={"latitude"}
        label={t("development.latitude")}
        required
        className="mt-4"
      >
        <Input disabled />
      </Form.Item>
      <Form.Item name={"longitude"} label={t("development.longitude")} required>
        <Input disabled />
      </Form.Item>

      <Form.Item name={"volume"} label={t("development.volume")} required>
        <Input placeholder="Ex: 200 meter" />
      </Form.Item>
      <Form.Item name={"budget"} label={t("development.budget")} required>
        <InputNumber
          controls={false}
          className="w-full"
          formatter={(value) =>
            `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          }
          parser={(value) => {
            if (!value) return "";
            return value.replace(/[^0-9]/g, "");
          }}
        />
      </Form.Item>
      <Form.Item
        name={"source_of_fund"}
        label={t("development.source_of_fund")}
        required
      >
        <Input placeholder="Ex: ADD" />
      </Form.Item>
      <Form.Item name={"year"} label={t("development.year")} required>
        <InputNumber
          controls={false}
          className="w-full"
          minLength={4}
          min={2010}
          max={new Date().getFullYear()}
        />
      </Form.Item>
      <Form.Item name={"start_at"} label={t("development.start_at")} required>
        <DatePicker className="w-full" />
      </Form.Item>
      <Form.Item name={"end_at"} label={t("development.end_at")} required>
        <DatePicker className="w-full" />
      </Form.Item>
      <Form.Item name={"status"} label={t("development.status")} required>
        <Select options={statusWorks} />
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
              setRecord(developmentState);
              setOpenDrawer(false);
            }}
          >
            {t("button.back")}
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default DevelopmentEdit;
