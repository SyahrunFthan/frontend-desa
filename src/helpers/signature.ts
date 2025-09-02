import type { Dispatch, SetStateAction } from "react";
import type React from "react";
import {
  MAX_SIZE,
  MIN_SIZE,
  PAGE_H,
  PAGE_W,
  type Path,
  type Point,
  type SignatureItem,
} from "../models/signature";
import type { MessageInstance } from "antd/es/message/interface";
import { processFail } from "./process";
import type { UploadFile } from "antd";
import type { RcFile } from "antd/es/upload";

interface EventProps {
  e: React.MouseEvent | React.TouchEvent;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const getEventPos = (params: EventProps): { x: number; y: number } => {
  const { e, canvasRef } = params;

  const canvas = canvasRef.current;
  if (!canvas) return { x: 0, y: 0 };

  const rect = canvas.getBoundingClientRect();
  let clientX: number, clientY: number;

  if ("touches" in e) {
    const touch = e.touches[0] || e.changedTouches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
};

interface StartProps {
  e: React.MouseEvent | React.TouchEvent;
  setIsDrawing: Dispatch<SetStateAction<boolean>>;
  setIsEmpty: Dispatch<SetStateAction<boolean>>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  setCurrentPath: Dispatch<SetStateAction<Point[]>>;
}

export const startDrawing = (params: StartProps) => {
  const { canvasRef, e, setIsDrawing, setIsEmpty, setCurrentPath } = params;
  e.preventDefault();
  setIsDrawing(true);
  setIsEmpty(false);

  const pos = getEventPos({ canvasRef: canvasRef, e });
  const newPoint: Point = {
    x: pos.x,
    y: pos.y,
    color: "#000000",
    size: 3,
  };

  setCurrentPath([newPoint]);

  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");
  if (ctx) {
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }
};

interface DrawProps {
  e: React.MouseEvent | React.TouchEvent;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  currentPath: Point[];
  setCurrentPath: Dispatch<SetStateAction<Point[]>>;
  isDrawing: boolean;
}

export const draw = (params: DrawProps) => {
  const { canvasRef, currentPath, e, isDrawing, setCurrentPath } = params;
  if (!isDrawing) return;
  e.preventDefault();

  const pos = getEventPos({ canvasRef: canvasRef, e });
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");

  if (ctx && currentPath.length > 0) {
    const lastPoint = currentPath[currentPath.length - 1];
    const midX = (lastPoint.x + pos.x) / 2;
    const midY = (lastPoint.y + pos.y) / 2;

    ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midX, midY);
    ctx.stroke();

    const newPoint: Point = {
      x: pos.x,
      y: pos.y,
      color: "#000000",
      size: 3,
    };

    setCurrentPath((prev) => [...prev, newPoint]);
  }
};

interface StopProps {
  isDrawing: boolean;
  setIsDrawing: Dispatch<SetStateAction<boolean>>;
  currentPath: Point[];
  setCurrentPath: Dispatch<SetStateAction<Point[]>>;
  paths: Path[];
  setPaths: Dispatch<SetStateAction<Path[]>>;
}

export const stopDrawing = (params: StopProps) => {
  const {
    currentPath,
    isDrawing,
    paths,
    setCurrentPath,
    setIsDrawing,
    setPaths,
  } = params;
  if (!isDrawing) return;

  setIsDrawing(false);

  if (currentPath.length > 0) {
    const newPath: Path = {
      points: currentPath,
      color: "#000000",
      size: 3,
    };
    setPaths([...paths, newPath]);
    setCurrentPath([]);
  }
};

interface SignatureFileProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  paths: Path[];
  isEmpty: boolean;
  messageApi: MessageInstance;
}

export const makeSignatureFile = async (
  params: SignatureFileProps
): Promise<UploadFile | null> => {
  const { canvasRef, paths, isEmpty, messageApi } = params;

  if (isEmpty || paths.length === 0) {
    processFail(messageApi, "downloadPng", "Tanda tangan kosong");
    return null;
  }

  const canvas = canvasRef.current;
  if (!canvas) return null;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext("2d");

  if (!tempCtx) {
    processFail(messageApi, "downloadPng", "Kontext canvas tidak ditemukan");
    return null;
  }

  tempCtx.fillStyle = "#ffffff";
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  tempCtx.drawImage(canvas, 0, 0);

  const blob: Blob | null = await new Promise((resolve) => {
    tempCanvas.toBlob((b) => resolve(b), "image/png");
  });

  if (!blob) {
    processFail(messageApi, "downloadPng", "Gagal membuat tanda tangan");
    return null;
  }

  const filename = `${new Date().getTime()}.png`;
  const file = new File([blob], filename, { type: "image/png" });

  const rcFile = file as RcFile;

  const objectUrl = URL.createObjectURL(file);
  const uploadFile: UploadFile = {
    uid: `${Date.now()}`,
    name: filename,
    status: "done",
    url: objectUrl,
    thumbUrl: objectUrl,
    originFileObj: rcFile,
  };

  return uploadFile;
};

interface ImageProps {
  url: string;
  opts?: { withCredentials: boolean };
}

export const imageUrlToDataUrl = async ({
  url,
  opts,
}: ImageProps): Promise<string> => {
  const res = await fetch(url, {
    credentials: opts?.withCredentials ? "include" : "same-origin",
  });
  if (!res.ok) throw new Error(`Gagal fetch signature: HTTP ${res.status}`);
  const blob = await res.blob();
  if (!blob.type.startsWith("image/")) throw new Error("URL bukan gambar");
  return await new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
};

export const loadImage = async (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const removeWhiteBg = async (
  dataUrl: string,
  threshold = 250
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context tidak tersedia"));
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const brightness = (r + g + b) / 3;
        if (brightness > threshold) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};

export const clamp = (v: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, v));
};

export const dataUrlToBytes = (
  dataUrl: string
): { bytes: Uint8Array; mime: string } => {
  const [header, base64] = dataUrl.split(",");
  const mime = header.substring(header.indexOf(":") + 1, header.indexOf(";"));
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { bytes, mime };
};

export function resizeSignature(
  s: SignatureItem,
  factor: number
): SignatureItem {
  let w = s.width * factor;
  let h = s.height * factor;

  const scaleDown = Math.max(MIN_SIZE / w, MIN_SIZE / h, 1);
  const scaleUp = Math.min(MAX_SIZE / w, MAX_SIZE / h, 1);
  const clampFactor =
    factor > 1 ? Math.min(factor, scaleUp) : Math.max(factor, scaleDown);

  w = Math.round(s.width * clampFactor);
  h = Math.round(s.height * clampFactor);

  const nx = clamp(s.x, 0, PAGE_W - w);
  const ny = clamp(s.y, 0, PAGE_H - h);

  return { ...s, width: w, height: h, x: nx, y: ny };
}
