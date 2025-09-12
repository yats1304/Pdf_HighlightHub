import React from "react";
import { Document, Page } from "react-pdf";

interface Highlight {
  pageNumber: number;
  id: string;
  rects: { top: number; left: number; width: number; height: number }[];
}

interface PdfPageWithHighlightsProps {
  fileUrl: string;
  pageNumber: number;
  scale: number;
  pdfOptions: object;
  onPageLoadSuccess: (page: any) => void;
  highlights: Highlight[];
  pageContainerRef: React.RefObject<HTMLDivElement | null>;
  handleTextSelection: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function PdfPageWithHighlights({
  fileUrl,
  pageNumber,
  scale,
  pdfOptions,
  onPageLoadSuccess,
  highlights,
  pageContainerRef,
  handleTextSelection,
}: PdfPageWithHighlightsProps) {
  return (
    <div
      ref={pageContainerRef}
      onMouseUp={handleTextSelection}
      className="relative"
      style={{
        display: "inline-block",
        backgroundColor: "#181a20",
        border: "2px solid #272a36",
        borderRadius: 12,
        margin: "0 auto",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        padding: "1.5rem 0.5rem",
      }}
    >
      {highlights
        .filter((h) => h.pageNumber === pageNumber)
        .map((highlight) =>
          highlight.rects.map((rect, idx) => (
            <div
              key={highlight.id + idx}
              style={{
                position: "absolute",
                top: rect.top * scale,
                left: rect.left * scale,
                width: rect.width * scale,
                height: rect.height * scale,
                backgroundColor: "rgba(255, 255, 0, 0.4)",
                pointerEvents: "none",
                borderRadius: 2,
                border: "1px solid rgba(255,255,0,0.7)",
                zIndex: 999,
              }}
            />
          ))
        )}
      <Document
        file={fileUrl}
        options={pdfOptions}
        loading={
          <div className="text-center text-gray-400">Loading PDF...</div>
        }
      >
        <Page
          pageNumber={pageNumber}
          scale={scale}
          onLoadSuccess={onPageLoadSuccess}
          loading={
            <div className="text-center text-gray-400">Loading Page...</div>
          }
          className="shadow-lg rounded-lg bg-white"
        />
      </Document>
    </div>
  );
}
