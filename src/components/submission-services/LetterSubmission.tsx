import { Spin } from "antd";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Document, Page } from "react-pdf";
import type { SubmissionServices } from "../../models/submissionService";
import {
  MAX_SIZE,
  MIN_SIZE,
  PAGE_H,
  PAGE_W,
  RESIZE_STEP,
  type SignatureItem,
} from "../../models/signature";
import { clamp, resizeSignature } from "../../helpers/signature";

interface Props {
  data: SubmissionServices | null;
  selectedSignature: string | null;
  setSelectedSignature: Dispatch<SetStateAction<string | null>>;
  signatures: SignatureItem[];
  setSignatures: Dispatch<SetStateAction<SignatureItem[]>>;
  numPages: number;
  setNumPages: Dispatch<SetStateAction<number>>;
  pdfFile: File | null;
  setViewSize: Dispatch<
    SetStateAction<Record<number, { w: number; h: number }>>
  >;
  setPdfFile: Dispatch<SetStateAction<File | null>>;
}

const LetterSubmission = (params: Props) => {
  const {
    data,
    selectedSignature,
    setSelectedSignature,
    setSignatures,
    signatures,
    numPages,
    setNumPages,
    pdfFile,
    setPdfFile,
    setViewSize,
  } = params;

  const [loading, setLoading] = useState(false);
  const zoom = 1;

  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const resizeRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origW: number;
    origH: number;
    origX: number;
    origY: number;
    keepAspect: boolean;
  } | null>(null);

  const onMouseDownSig = (e: React.MouseEvent, sig: SignatureItem) => {
    e.stopPropagation();
    setSelectedSignature(sig.id);
    dragRef.current = {
      id: sig.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: sig.x,
      origY: sig.y,
    };
  };

  const onMouseDownResize = (e: React.MouseEvent, sig: SignatureItem) => {
    e.stopPropagation();
    setSelectedSignature(sig.id);
    resizeRef.current = {
      id: sig.id,
      startX: e.clientX,
      startY: e.clientY,
      origW: sig.width,
      origH: sig.height,
      origX: sig.x,
      origY: sig.y,
      keepAspect: !e.shiftKey,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (resizeRef.current) {
      const { id, startX, startY, origW, origH, origX, origY, keepAspect } =
        resizeRef.current;

      const dx = (e.clientX - startX) / zoom;
      const dy = (e.clientY - startY) / zoom;

      let newW = origW + dx;
      let newH = keepAspect ? (newW / origW) * origH : origH + dy;

      newW = Math.max(MIN_SIZE, Math.min(MAX_SIZE, newW));
      newH = Math.max(MIN_SIZE, Math.min(MAX_SIZE, newH));

      newW = Math.min(newW, PAGE_W - origX);
      newH = Math.min(newH, PAGE_H - origY);

      setSignatures((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, width: Math.round(newW), height: Math.round(newH) }
            : s
        )
      );
      return;
    }

    if (!dragRef.current) return;
    const { id, startX, startY, origX, origY } = dragRef.current;
    const dx = (e.clientX - startX) / zoom;
    const dy = (e.clientY - startY) / zoom;
    setSignatures((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              x: clamp(origX + dx, 0, PAGE_W - s.width),
              y: clamp(origY + dy, 0, PAGE_H - s.height),
            }
          : s
      )
    );
  };

  const onMouseUp = () => {
    dragRef.current = null;
    resizeRef.current = null;
  };

  const onClickCanvas = () => setSelectedSignature(null);

  useEffect(() => {
    let alive = true;
    const ac = new AbortController();
    const url = data?.submission_path;
    if (!url) {
      setPdfFile(null);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(url, {
          credentials: "include",
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        if (!(blob.type || "").includes("pdf"))
          throw new Error("Berkas bukan PDF");
        const name =
          new URL(url, window.location.origin).pathname.split("/").pop() ||
          `dokumen-${Date.now()}.pdf`;
        const file = new File(
          [blob],
          name.endsWith(".pdf") ? name : `${name}.pdf`,
          {
            type: "application/pdf",
            lastModified: Date.now(),
          }
        );
        if (!alive) return;
        setPdfFile(file);
      } catch (e) {
        if ((e as any)?.name !== "AbortError") {
          console.error(e);
          setPdfFile(null);
        }
      } finally {
        alive && setLoading(false);
      }
    })();

    return () => {
      alive = false;
      ac.abort();
    };
  }, [data?.submission_path]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedSignature) return;
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setSignatures((prev) =>
          prev.map((s) =>
            s.id === selectedSignature ? resizeSignature(s, RESIZE_STEP) : s
          )
        );
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        setSignatures((prev) =>
          prev.map((s) =>
            s.id === selectedSignature ? resizeSignature(s, 1 / RESIZE_STEP) : s
          )
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedSignature, setSignatures]);

  return (
    <div
      ref={containerRef}
      className="relative border rounded-xl bg-white shadow-lg overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onClick={onClickCanvas}
    >
      <Spin spinning={loading} size="large">
        {pdfFile && (
          <div className="relative">
            <Document
              file={pdfFile}
              onLoadSuccess={(pdf) =>
                setNumPages((prev) =>
                  prev === pdf.numPages ? prev : pdf.numPages
                )
              }
              loading={null}
              error={<div className="p-4 text-red-500">Gagal memuat PDF</div>}
            >
              {Array.from({ length: numPages }, (_, idx) => (
                <div key={idx} className="relative mb-6">
                  <Page
                    pageNumber={idx + 1}
                    width={PAGE_W}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={null}
                    onLoadSuccess={(page) => {
                      const vp = page.getViewport({ scale: 1 });
                      const w = PAGE_W;
                      const h = (vp.height / vp.width) * w;
                      setViewSize((prev) => ({ ...prev, [idx]: { w, h } }));
                    }}
                  />

                  {signatures
                    .filter((s) => s.page === idx)
                    .map((signature) => (
                      <div
                        key={signature.id}
                        className={`absolute border-2 ${
                          selectedSignature === signature.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-transparent hover:border-gray-300"
                        }`}
                        style={{
                          left: signature.x * zoom,
                          top: signature.y * zoom,
                          width: signature.width * zoom,
                          height: signature.height * zoom,
                          cursor: "move",
                          userSelect: "none",
                        }}
                        onMouseDown={(e) => onMouseDownSig(e, signature)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSignature(signature.id);
                        }}
                      >
                        <img
                          src={signature.dataUrl}
                          alt="Signature"
                          className="w-full h-full object-contain rounded pointer-events-none"
                          draggable={false}
                        />

                        <div
                          className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-sm cursor-se-resize border border-white shadow"
                          onMouseDown={(e) => onMouseDownResize(e, signature)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ))}
                </div>
              ))}
            </Document>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default LetterSubmission;
