import {
  CheckOutlined,
  ClearOutlined,
  CloseOutlined,
  EditOutlined,
  SaveOutlined,
  SignatureOutlined,
} from "@ant-design/icons";
import { Button, Col, Divider, Flex, Modal, Row } from "antd";
import { useRef, useState } from "react";
import type { Path, Point } from "../../models/signature";
import {
  draw,
  makeSignatureFile,
  startDrawing,
  stopDrawing,
} from "../../helpers/signature";
import type { MessageInstance } from "antd/es/message/interface";
import { signatureEmoloyeeUploaded } from "../../services/employee";
import type { NotificationInstance } from "antd/es/notification/interface";

interface Props {
  value: string;
  id: string;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  fetchData: () => void;
}

const EmployeeSignatureUpload = (params: Props) => {
  const { id, value, messageApi, fetchData, notificationApi } = params;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paths, setPaths] = useState<Path[]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleCancel = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setPaths([]);
      setCurrentPath([]);
      setIsEmpty(true);
      setOpenModal(false);
      setIsDrawing(false);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setPaths([]);
      setCurrentPath([]);
      setIsEmpty(true);
      setIsDrawing(false);
    }
  };

  const handleSave = async () => {
    const file = await makeSignatureFile({
      canvasRef,
      paths,
      isEmpty,
      messageApi,
    });
    let formData = new FormData();
    if (file?.originFileObj) {
      formData.append("file", file.originFileObj);
    }

    signatureEmoloyeeUploaded({
      data: formData,
      fetchData,
      handleCancel,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  return (
    <>
      {value !== null ? (
        <Flex gap={"small"}>
          <CheckOutlined className="text-green-500" />
          <Button type="link" onClick={() => setOpenModal(true)}>
            <EditOutlined />
          </Button>
        </Flex>
      ) : (
        <Button type="link" onClick={() => setOpenModal(true)}>
          <SignatureOutlined />
        </Button>
      )}

      <Modal
        open={openModal}
        width={720}
        title="Buat Tanda Tangan"
        closable={{ "aria-label": "Custom Close Button" }}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div className="relative mb-6">
          <canvas
            ref={canvasRef}
            width={740}
            height={300}
            className={`w-full border-2 border-dashed border-gray-300 rounded-xl bg-white cursor-crosshair transition-all duration-300 hover:border-blue-400 ${
              isDrawing ? "border-purple-500 shadow-lg" : ""
            }`}
            onMouseDown={(e) =>
              startDrawing({
                e,
                setIsDrawing,
                setIsEmpty,
                canvasRef,
                setCurrentPath,
              })
            }
            onMouseMove={(e) =>
              draw({ canvasRef, e, isDrawing, currentPath, setCurrentPath })
            }
            onMouseUp={() =>
              stopDrawing({
                isDrawing,
                setIsDrawing,
                paths,
                setPaths,
                currentPath,
                setCurrentPath,
              })
            }
            onMouseLeave={() =>
              stopDrawing({
                isDrawing,
                setIsDrawing,
                paths,
                setPaths,
                currentPath,
                setCurrentPath,
              })
            }
            onTouchStart={(e) =>
              startDrawing({
                e,
                setIsDrawing,
                setIsEmpty,
                canvasRef,
                setCurrentPath,
              })
            }
            onTouchMove={(e) =>
              draw({
                canvasRef: canvasRef,
                e,
                isDrawing,
                currentPath,
                setCurrentPath,
              })
            }
            onTouchEnd={() =>
              stopDrawing({
                currentPath,
                isDrawing,
                paths,
                setCurrentPath,
                setIsDrawing,
                setPaths,
              })
            }
          />
          {isEmpty && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-gray-400">
                <EditOutlined className="text-4xl mb-2" />
                <div className="text-lg">
                  Klik dan gerakkan untuk menggambar tanda tangan
                </div>
                <div className="text-sm mt-1">
                  Gunakan mouse atau sentuh layar
                </div>
              </div>
            </div>
          )}
        </div>

        <Divider />

        <Row gutter={[16, 16]} justify="center">
          <Col>
            <Button
              type="default"
              icon={<CloseOutlined />}
              onClick={handleCancel}
              disabled={processing}
              loading={processing}
            >
              Batal
            </Button>
          </Col>
          <Col>
            <Button
              type="default"
              danger
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={processing}
              loading={processing}
            >
              Hapus
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              disabled={isEmpty || processing}
              loading={processing}
            >
              Simpan
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default EmployeeSignatureUpload;
