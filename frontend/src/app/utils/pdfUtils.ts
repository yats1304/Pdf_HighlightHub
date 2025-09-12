import { PDFDocument, rgb } from "pdf-lib";

export async function embedHighlightsToPdf(
  existingPdfBytes: Uint8Array | ArrayBuffer,
  highlights: {
    id: string;
    pageNumber: number;
    rects: { top: number; left: number; width: number; height: number }[];
    text: string;
  }[]
) {
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  for (const highlight of highlights) {
    const page = pdfDoc.getPage(highlight.pageNumber - 1);
    for (const rect of highlight.rects) {
      const y = page.getHeight() - rect.top - rect.height;
      page.drawRectangle({
        x: rect.left,
        y,
        width: rect.width,
        height: rect.height,
        color: rgb(1, 1, 0),
        opacity: 0.4,
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export function downloadPdf(
  pdfBytes: Uint8Array | ArrayBuffer,
  filename: string
) {
  let arrayBuffer: ArrayBuffer;

  if (pdfBytes instanceof Uint8Array) {
    arrayBuffer = pdfBytes.buffer.slice(
      pdfBytes.byteOffset,
      pdfBytes.byteOffset + pdfBytes.byteLength
    ) as ArrayBuffer; // force cast
  } else {
    arrayBuffer = pdfBytes as ArrayBuffer;
  }

  const blob = new Blob([arrayBuffer], { type: "application/pdf" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function savePdfWithHighlights(
  fileUrl: string,
  highlights: any[],
  filename: string
) {
  const res = await fetch(fileUrl);
  const existingPdfBytes = await res.arrayBuffer();
  const updatedPdfBytes = await embedHighlightsToPdf(
    existingPdfBytes,
    highlights
  );
  downloadPdf(updatedPdfBytes, filename);
}
