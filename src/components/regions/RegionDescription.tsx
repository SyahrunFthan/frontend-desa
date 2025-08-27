import type { DescriptionsProps } from "antd/es/descriptions";
import type { RegionModel } from "../../models/region";
import type { TFunction } from "i18next";
import { Descriptions, Typography } from "antd";
import dayjs from "dayjs";

interface Props {
  region: RegionModel | null;
  t: TFunction;
  total: number | undefined;
  totalResident: number;
}

const RegionDescription = ({ region, t, total, totalResident }: Props) => {
  const items: DescriptionsProps["items"] = [
    {
      key: "fullname",
      label: t("region.detail.leader"),
      children: region?.leader.fullname,
      span: 1,
    },
    {
      key: "registration_at",
      label: t("region.detail.registration_at"),
      children: dayjs(region?.createdAt, "YYYY-MM-DD HH:mm:ss").format(
        "dddd, DD MMMM YYYY"
      ),
      span: 1,
    },
    {
      key: "land_area",
      label: t("region.land_area"),
      children: region?.land_area,
      span: 2,
    },
    {
      key: "total_facility",
      label: t("region.detail.total_facility"),
      children: total,
      span: 1,
    },
    {
      key: "total_resident",
      label: t("region.detail.total_resident"),
      children: totalResident,
      span: 1,
    },
  ];
  return (
    <>
      <Typography.Title level={3}>
        {t("region.detail.title")} {region?.name}
      </Typography.Title>

      <Descriptions items={items} bordered size="middle" column={2} />
    </>
  );
};

export default RegionDescription;
