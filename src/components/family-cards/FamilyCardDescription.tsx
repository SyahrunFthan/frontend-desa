import { Card, Descriptions, Typography } from "antd";
import type { DescriptionsProps } from "antd/es/descriptions";
import type { FamilyCardModel } from "../../models/familyCard";

interface Props {
  familyCard: FamilyCardModel;
}

const FamilyCardDescription = ({ familyCard }: Props) => {
  const items: DescriptionsProps["items"] = [
    {
      label: "ID Family",
      key: "family_id",
      children: familyCard.family_id,
      span: 1,
    },
    {
      label: "Address",
      key: "address",
      children: familyCard.address,
      span: 1,
    },
    {
      label: "Total Family",
      key: "total_family",
      children: familyCard.total_family,
      span: 1,
    },
  ];

  return (
    <Card className="mb-5">
      <Typography.Title level={3}>Detail Family</Typography.Title>
      <Descriptions items={items} bordered size="middle" />
    </Card>
  );
};

export default FamilyCardDescription;
