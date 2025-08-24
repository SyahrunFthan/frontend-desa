import { Button, Flex, Form, Input, InputNumber, Select } from "antd";
import type { TFunction } from "i18next";
import { useState, type Dispatch, type SetStateAction } from "react";
import { type_facilities } from "../../models/facility";
import { status } from "../../models/global";
import MapView from "../maps/MapView";
import { facilityCreated } from "../../services/facility";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import DrawControl from "../maps/DrawControl";
import AutoCenter from "../maps/AutoCenter";

interface Props {
  t: TFunction;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  fetchData: () => void;
}

const FacilityCreate = ({
  t,
  setOpenDrawer,
  fetchData,
  messageApi,
  notificationApi,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm();
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        const data = {
          name: values.name ?? "",
          type_facility: values.type_facility ?? "",
          status: values.status ?? "",
          description: values.description ?? "",
          latitude: values.latitude ?? 95,
          longitude: values.longitude ?? 185,
        };

        facilityCreated({
          data,
          fetchData,
          form,
          messageApi,
          notificationApi,
          setOpenDrawer,
          setProcessing,
        });
      }}
    >
      <Form.Item name={"name"} label={t("facility.name")} required>
        <Input />
      </Form.Item>
      <Form.Item
        name={"type_facility"}
        label={t("facility.type_facility")}
        required
      >
        <Select options={type_facilities} />
      </Form.Item>
      <Form.Item name={"status"} label={t("facility.status")} required>
        <Select options={status} />
      </Form.Item>
      <Form.Item name={"description"} label={t("facility.description")}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name={"latitude"} label={t("facility.latitude")} required>
        <InputNumber controls={false} className="w-full" disabled />
      </Form.Item>
      <Form.Item name={"longitude"} label={t("facility.longitude")} required>
        <InputNumber controls={false} className="w-full" disabled />
      </Form.Item>
      <Form.Item name={"latitude"} label={t("facility.location")} required>
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
        </MapView>
      </Form.Item>
      <Form.Item>
        <Flex gap={"middle"}>
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
              setOpenDrawer(false);
              setLocation({
                latitude: 0,
                longitude: 0,
              });
            }}
            disabled={processing}
            loading={processing}
          >
            {t("button.back")}
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default FacilityCreate;
