import { Descriptions, Tag } from "antd";
import type { DescriptionsItemType } from "antd/es/descriptions";
import type { TFunction } from "i18next";
import {
  status_submissions,
  type SubmissionServices,
} from "../../models/submissionService";
import dayjs from "dayjs";

interface Props {
  data: SubmissionServices | null;
  t: TFunction;
}

const DescriptionSubmissionService = (params: Props) => {
  const { t, data } = params;

  const items: DescriptionsItemType[] = [
    {
      key: "fullname",
      label: t("residents.fullname"),
      children: data?.resident?.fullname,
      span: 2,
    },
    {
      key: "resident_id",
      label: t("residents.resident_id"),
      children: data?.resident?.resident_id,
      span: 1,
    },
    {
      key: "service_id",
      label: t("submissionService.service_id"),
      children: data?.service?.name,
      span: 1,
    },
    {
      key: "date_of_issue",
      label: t("submissionService.date_of_submission"),
      children: dayjs(data?.date_of_submission).format("DD/MM/YYYY"),
      span: 1,
    },
    {
      key: "status_submission",
      label: t("submissionService.status_submission"),
      children: (
        <Tag
          color={
            data?.status_submission === "pending"
              ? "yellow"
              : data?.status_submission === "rejected"
              ? "red"
              : "green"
          }
        >
          {
            status_submissions.find(
              (item) => item.value === data?.status_submission
            )?.label
          }
        </Tag>
      ),
      span: 1,
    },
    {
      key: "code",
      label: t("submissionService.code"),
      children: data?.code ?? "-",
      span: 2,
    },
  ];

  return <Descriptions items={items} bordered size="middle" column={2} />;
};

export default DescriptionSubmissionService;
