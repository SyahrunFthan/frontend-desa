import { useTranslation } from "react-i18next";
import AdminLayout from "../../../layouts/adminLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DashboardOutlined, TagOutlined } from "@ant-design/icons";
import { DescriptionSubmissionService } from "../../../components";
import { useEffect, useState } from "react";
import type { SubmissionServices } from "../../../models/submissionService";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";
import { Card, Col, message, notification, Row, Typography } from "antd";
import { getSubmissionServiceId } from "../../../apis";
import type { EmployeeModel } from "../../../models/employee";
import type { SignatureItem } from "../../../models/signature";
import LetterSubmissionForm from "../../../components/submission-services/LetterSubmissionForm";
import LetterSubmission from "../../../components/submission-services/LetterSubmission";

const DetailSubmissionService = () => {
  const [submissionService, setSubmissionService] =
    useState<SubmissionServices | null>(null);
  const [employees, setEmployees] = useState<EmployeeModel[]>([]);
  const [signatures, setSignatures] = useState<SignatureItem[]>([]);
  const [selectedSignature, setSelectedSignature] = useState<string | null>(
    null
  );
  const [viewSize, setViewSize] = useState<
    Record<number, { w: number; h: number }>
  >({});
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();

  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await getSubmissionServiceId(id ?? "");
      const { employees, submissionService } = response.data;
      setEmployees(employees);
      setSubmissionService(submissionService);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      processFail(
        messageApi,
        "fetchDataSubmissionService",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AdminLayout
      pageName={
        submissionService?.code ?? submissionService?.resident?.fullname
      }
      breadCrumbs={[
        {
          title: (
            <Link to={"/admin/dashboard"}>
              <DashboardOutlined />
              <span className="ml-1">{t("dashboard")}</span>
            </Link>
          ),
        },
        {
          title: (
            <Link to={"/admin/submission-service"}>
              <TagOutlined />
              <span className="ml-1">{t("submissionService.title")}</span>
            </Link>
          ),
        },
        {
          title: "Detail",
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}

      <Card className="mb-5">
        <Typography.Title level={3}>
          {t("submissionService.detail.title")}
        </Typography.Title>
        <DescriptionSubmissionService t={t} data={submissionService} />
      </Card>

      <Row gutter={[16, 16]}>
        <Col sm={24} xs={24} md={12} lg={12} xl={6} xxl={6}>
          <Card>
            <LetterSubmissionForm
              employees={employees}
              notificationApi={notificationApi}
              messageApi={messageApi}
              signatures={signatures}
              setSelectedSignature={setSelectedSignature}
              setSignatures={setSignatures}
              selectedSignature={selectedSignature}
              numPages={numPages}
              pdfFile={pdfFile}
              id={id ?? ""}
              navigate={navigate}
              viewSize={viewSize}
              submissionService={submissionService}
              t={t}
            />
          </Card>
        </Col>
        <Col sm={24} xs={24} md={12} lg={12} xl={18} xxl={18}>
          <Card>
            <Typography.Title level={3}>Letter Submission</Typography.Title>

            <LetterSubmission
              data={submissionService}
              selectedSignature={selectedSignature}
              setSelectedSignature={setSelectedSignature}
              signatures={signatures}
              setSignatures={setSignatures}
              numPages={numPages}
              setNumPages={setNumPages}
              pdfFile={pdfFile}
              setPdfFile={setPdfFile}
              setViewSize={setViewSize}
            />
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default DetailSubmissionService;
