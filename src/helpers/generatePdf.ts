import { PDFDocument } from "pdf-lib";
import {
  PAGE_H,
  PAGE_W,
  type SignatureItem,
  type ViewSize,
} from "../models/signature";
import { dataUrlToBytes } from "./signature";

export async function generatePdf(
  pdfFile: File | null,
  signatures: SignatureItem[],
  opts?: { outName?: string; viewSize?: ViewSize }
): Promise<File> {
  if (!pdfFile) throw new Error("pdfFile tidak boleh null");

  const src = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(src);
  const pageCount = pdfDoc.getPageCount();

  const imgCache = new Map<string, any>();

  for (let p = 0; p < pageCount; p++) {
    const page = pdfDoc.getPage(p);
    const { width: pdfW, height: pdfH } = page.getSize();

    const viewW = opts?.viewSize?.[p]?.w ?? PAGE_W;
    const viewH = opts?.viewSize?.[p]?.h ?? PAGE_H;

    const sx = pdfW / viewW;
    const sy = pdfH / viewH;

    const pageSigs = signatures.filter((s) => s.page === p);
    if (!pageSigs.length) continue;

    for (const s of pageSigs) {
      let img = imgCache.get(s.dataUrl);
      if (!img) {
        const { bytes, mime } = dataUrlToBytes(s.dataUrl);
        img = mime.includes("png")
          ? await pdfDoc.embedPng(bytes)
          : await pdfDoc.embedJpg(bytes);
        imgCache.set(s.dataUrl, img);
      }

      const drawW = s.width * sx;
      const drawH = s.height * sy;
      const drawX = s.x * sx;
      const drawY = pdfH - (s.y * sy + drawH);

      page.drawImage(img, { x: drawX, y: drawY, width: drawW, height: drawH });
    }
  }

  const name =
    opts?.outName ??
    (pdfFile?.name?.replace(/\.pdf$/i, "") || "dokumen") +
      `-signed-${Date.now()}.pdf`;

  const u8 = await pdfDoc.save();
  const ab = u8.buffer.slice(
    u8.byteOffset,
    u8.byteOffset + u8.byteLength
  ) as ArrayBuffer;
  const blob = new Blob([ab], { type: "application/pdf" });
  return new File([blob], name, {
    type: "application/pdf",
    lastModified: Date.now(),
  });
}
