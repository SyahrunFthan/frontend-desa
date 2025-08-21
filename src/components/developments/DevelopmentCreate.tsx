import {
  Button,
  Card,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
} from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { TFunction } from "i18next";
import { useEffect, useState } from "react";
import { statusWorks } from "../../models/development";
import MapView from "../maps/MapView";
import { Marker, useMapEvents } from "react-leaflet";
import type { LatLngLiteral } from "leaflet";
import { developmentCreated } from "../../services/development";

interface Props {
  t: TFunction;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  fetchData: () => void;
}

const ClickHandler = ({
  setPos,
  onChange,
}: {
  setPos: (p: LatLngLiteral) => void;
  onChange?: (p: LatLngLiteral) => void;
}) => {
  useMapEvents({
    click(e) {
      const p = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPos(p);
      onChange?.(p);
    },
  });
  return null;
};

const DevelopmentCreate = ({
  fetchData,
  messageApi,
  notificationApi,
  t,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm();
  const lat = Form.useWatch("latitude", form);
  const lng = Form.useWatch("longitude", form);
  const [pos, setPos] = useState<LatLngLiteral | null>(() => {
    if (lat && lng) return { lat: lat, lng: lng };
    return null;
  });

  useEffect(() => {
    if (typeof lat === "number" && typeof lng === "number") {
      setPos({ lat: lat, lng: lng });
    } else {
      setPos(null);
    }
  }, [lat, lng]);

  return (
    <Card>
      <Typography.Title level={3}>{t("development.createOf")}</Typography.Title>

      <Form
        layout="vertical"
        form={form}
        onFinish={(values) => {
          const data = {
            name: values.name ?? "",
            location: values.location ?? "",
            latitude: values.latitude ?? 0,
            longitude: values.longitude ?? 0,
            volume: values.volume ?? "",
            budget: values.budget ?? 0,
            source_of_fund: values.source_of_fund ?? "",
            year: values.year ?? 0,
            start_at: values.start_at ?? "",
            end_at: values.end_at ?? "",
            status: values.status ?? "",
          };

          developmentCreated({
            data,
            fetchData,
            form,
            messageApi,
            notificationApi,
            setProcessing,
          });
        }}
      >
        <div className="flex flex-col lg:flex-row w-full gap-5">
          <div className="flex flex-col w-full">
            <Form.Item
              name={"name"}
              label={t("development.name")}
              required
              className="w-full lg:w-[50%]"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={"location"}
              label={t("development.location")}
              required
              className="w-full lg:w-[50%]"
            >
              <Input />
            </Form.Item>
            <Flex gap={"middle"} className="w-full lg:w-[50%]">
              <Form.Item
                name={"latitude"}
                label={t("development.latitude")}
                required
                className="w-full"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name={"longitude"}
                label={t("development.longitude")}
                required
                className="w-full"
              >
                <Input disabled />
              </Form.Item>
            </Flex>
            <Form.Item
              name={"volume"}
              label={t("development.volume")}
              required
              className="w-full lg:w-[50%]"
            >
              <Input placeholder="Ex: 200 meter" />
            </Form.Item>
            <Flex gap={"middle"}>
              <Form.Item
                name={"budget"}
                label={t("development.budget")}
                required
                className="w-full lg:w-[25%]"
              >
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
                className="w-full lg:w-[25%]"
              >
                <Input placeholder="Ex: ADD" />
              </Form.Item>
              <Form.Item
                name={"year"}
                label={t("development.year")}
                required
                className="w-full lg:w-[25%]"
              >
                <InputNumber
                  controls={false}
                  className="w-full"
                  minLength={4}
                  min={2010}
                  max={new Date().getFullYear()}
                />
              </Form.Item>
            </Flex>
            <Flex gap={"middle"}>
              <Form.Item
                name={"start_at"}
                label={t("development.start_at")}
                required
                className="w-full lg:w-[25%]"
              >
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item
                name={"end_at"}
                label={t("development.end_at")}
                required
                className="w-full lg:w-[25%]"
              >
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item
                name={"status"}
                label={t("development.status")}
                required
                className="w-full lg:w-[25%]"
              >
                <Select options={statusWorks} />
              </Form.Item>
            </Flex>
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
                  }}
                >
                  {t("button.reset")}
                </Button>
              </Flex>
            </Form.Item>
          </div>
          <div className="flex flex-col w-full items-end">
            <div className="flex flex-col w-[80%]">
              <MapView>
                <ClickHandler
                  setPos={setPos}
                  onChange={(p) =>
                    form.setFieldsValue({ latitude: p.lat, longitude: p.lng })
                  }
                />

                {pos && (
                  <Marker
                    position={pos}
                    draggable
                    eventHandlers={{
                      dragend: (e) => {
                        const p = (e.target as L.Marker).getLatLng();
                        const next = { lat: p.lat, lng: p.lng };
                        setPos(next);
                      },
                    }}
                  />
                )}
              </MapView>
            </div>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default DevelopmentCreate;
