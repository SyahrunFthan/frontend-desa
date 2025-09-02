import { Button, Flex, Form, Input, Select, type FormProps } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { EmployeeModel } from "../../models/employee";
import type { TFunction } from "i18next";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Option } from "../../models/global";
import { PlusOutlined } from "@ant-design/icons";
import type { SignatureItem, ViewSize } from "../../models/signature";
import {
  imageUrlToDataUrl,
  loadImage,
  removeWhiteBg,
} from "../../helpers/signature";
import { processFail } from "../../helpers/process";
import { generatePdf } from "../../helpers/generatePdf";
import {
  status_submissions,
  type SubmissionServices,
} from "../../models/submissionService";
import { submissionServiceUpdateStatus } from "../../services/submissionService";
import type { NavigateFunction } from "react-router-dom";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  employees: EmployeeModel[];
  selectedSignature: string | null;
  signatures: SignatureItem[];
  setSignatures: Dispatch<SetStateAction<SignatureItem[]>>;
  setSelectedSignature: Dispatch<SetStateAction<string | null>>;
  numPages: number;
  id: string;
  pdfFile: File | null;
  navigate: NavigateFunction;
  viewSize: ViewSize;
  t: TFunction;
  submissionService: SubmissionServices | null;
}

const LetterSubmissionForm = (params: Props) => {
  const {
    messageApi,
    notificationApi,
    signatures,
    employees,
    t,
    setSelectedSignature,
    setSignatures,
    selectedSignature,
    numPages,
    pdfFile,
    id,
    navigate,
    viewSize,
    submissionService,
  } = params;

  const [processing, setProcessing] = useState(false);
  const [optionEmployee, setOptionEmployee] = useState<Option[]>([]);
  const [form] = Form.useForm();

  const handleAddSignature = async () => {
    try {
      const dataUrl = await imageUrlToDataUrl({ url: selectedSignature ?? "" });
      const cleanedDataUrl = await removeWhiteBg(dataUrl, 240);
      const img = await loadImage(cleanedDataUrl);

      const targetW = 240;
      const scale = Math.min(1, targetW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      const lastPageIndex = Math.max(0, (numPages ?? 1) - 1);

      const sig: SignatureItem = {
        id: `${Date.now()}`,
        page: lastPageIndex,
        x: 40,
        y: 40,
        width: w,
        height: h,
        dataUrl: cleanedDataUrl,
      };
      setSignatures([...signatures, sig]);
    } catch (e) {
      processFail(
        messageApi,
        "handleAddSignature",
        "Gagal memuat tanda tangan"
      );
    }
  };

  const handleSubmit: FormProps["onFinish"] = async (values) => {
    const signedFile = await generatePdf(pdfFile, signatures, {
      viewSize: viewSize,
    });
    let formData = new FormData();
    formData.append("code", values.code ?? "");
    formData.append("status_submission", values.status_submission ?? "");

    if (signedFile) {
      formData.append("is_signed", String(true));
      formData.append("file", signedFile);
    }

    submissionServiceUpdateStatus({
      data: formData,
      fetchData: () =>
        navigate({
          pathname: "/admin/submission-service",
          search: "?tab=history-submission",
        }),
      form,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  useEffect(() => {
    const options = employees.map((employee) => ({
      value: employee.id,
      label: employee.fullname,
    }));
    setOptionEmployee(options);
  }, [employees]);

  useEffect(() => {
    form.setFieldsValue(submissionService);
  }, [submissionService]);

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Form.Item name={"code"} label={t("submissionService.code")} required>
        <Input />
      </Form.Item>
      <Form.Item
        name={"employee_id"}
        label={t("submissionService.chooseSignature")}
      >
        <Flex gap={"small"}>
          <Select
            options={optionEmployee}
            allowClear={true}
            onChange={(value) => {
              const employee = employees.find((e) => e.id === value);

              setSelectedSignature(employee?.signature_path ?? null);
            }}
            onClear={() => {
              setSelectedSignature(null);
              setSignatures([]);
            }}
          />
          <Button
            type="primary"
            disabled={
              selectedSignature === null
                ? true
                : false || signatures.length > 0
                ? true
                : false
            }
            onClick={handleAddSignature}
          >
            <PlusOutlined />
          </Button>
        </Flex>
      </Form.Item>

      <Form.Item
        name={"status_submission"}
        label={t("submissionService.status_submission")}
        rules={[{ required: true }]}
      >
        <Select
          options={status_submissions.filter((f) => f.value !== "pending")}
        />
      </Form.Item>
      <Form.Item>
        <Flex gap={"small"}>
          <Button
            disabled={processing}
            loading={processing}
            htmlType="reset"
            onClick={() => {
              form.resetFields();
              setSelectedSignature(null);
              setSignatures([]);
            }}
          >
            {t("button.reset")}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={processing}
            loading={processing}
          >
            {t("button.save")}
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default LetterSubmissionForm;
