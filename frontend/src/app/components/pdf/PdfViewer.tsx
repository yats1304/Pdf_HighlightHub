"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import useWindowSize from "../../hooks/useWindowSize";
import {
  FiDownload,
  FiPrinter,
  FiShare2,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
  FiMaximize2,
} from "react-icons/fi";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

interface PdfViewerProps {
  fileUrl: string;
  fileName?: string;
  fileSize?: string;
  className?: string;
  onPageChange?: (page: number) => void;
}

export default function PdfViewer({
  fileUrl,
  fileName = "",
  fileSize = "",
  className = "",
  onPageChange,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageDimensions, setPageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const windowSize = useWindowSize();

  const pdfOptions = useMemo(
    () => ({
      cMapUrl: "cmaps/",
      cMapPacked: true,
    }),
    []
  );

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setPageNumber(1);
      if (onPageChange) onPageChange(1);
    },
    [onPageChange]
  );

  const onPageLoadSuccess = useCallback((page: any) => {
    setPageDimensions({
      width: page.originalWidth,
      height: page.originalHeight,
    });
  }, []);

  const changePage = (offset: number) => {
    setPageNumber((prevPage) => {
      const newPage = Math.min(Math.max(prevPage + offset, 1), numPages);
      if (onPageChange) onPageChange(newPage);
      return newPage;
    });
  };

  const zoomIn = () => setZoom((z) => Math.min(z + 0.2, 2));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.2, baseScale));

  // Helper to display size in readable format (if provided as bytes)
  function humanFileSize(size: string): string {
    if (!size) return "";
    const bytes = parseFloat(size);
    if (isNaN(bytes)) return size;
    const thresh = 1024;
    if (bytes < thresh) return bytes + " B";
    const units = ["KB", "MB", "GB", "TB"];
    let u = -1;
    let b = bytes;
    do {
      b /= thresh;
      ++u;
    } while (b >= thresh && u < units.length - 1);
    return b.toFixed(2) + " " + units[u];
  }

  // Responsive scale base
  const padding = 32;
  const toolbarHeight = 76;
  const viewportWidth = windowSize?.width || 600;
  const viewportHeight = windowSize?.height || 800;
  const maxWidth = viewportWidth - padding * 2;
  const maxHeight = viewportHeight - toolbarHeight - padding * 2;
  let baseScale = 1;
  if (pageDimensions) {
    const scaleX = maxWidth / pageDimensions.width;
    const scaleY = maxHeight / pageDimensions.height;
    baseScale = Math.min(scaleX, scaleY, 1);
  }
  const effectiveScale = baseScale * zoom;

  if (!fileUrl) {
    return (
      <div className="text-center p-6 text-red-500">
        No PDF found or loaded.
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-10 flex flex-col items-center bg-[#22252c] min-h-full min-w-full ${className}`}
      style={{ background: "#21232a" }}
    >
      {/* Toolbar */}
      <div
        className="w-full max-w-5xl mx-auto flex items-center justify-between px-6 py-4 bg-[#242630] bg-opacity-95 shadow-lg rounded-xl mt-7"
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 20,
        }}
      >
        <div className="flex items-center gap-3">
          <FiArrowLeft
            size={26}
            className="text-gray-300 hover:text-blue-500 cursor-pointer"
            onClick={() => changePage(-1)}
            style={{
              opacity: pageNumber <= 1 ? 0.5 : 1,
              pointerEvents: pageNumber <= 1 ? "none" : "auto",
            }}
          />
          <FiArrowRight
            size={26}
            className="text-gray-300 hover:text-blue-500 cursor-pointer"
            onClick={() => changePage(1)}
            style={{
              opacity: pageNumber >= numPages ? 0.5 : 1,
              pointerEvents: pageNumber >= numPages ? "none" : "auto",
            }}
          />
          <span className="ml-2 px-3 py-1 rounded font-semibold bg-[#1e293b] text-blue-400">
            {fileName}
          </span>
          <span className="ml-2 text-xs text-gray-400 opacity-90">
            PDF {fileSize && `| ${humanFileSize(fileSize)}`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={zoomOut}
            disabled={zoom <= baseScale}
            className="p-2 text-blue-300 bg-[#1e293b] rounded hover:text-blue-500 transition disabled:opacity-40"
            aria-label="Zoom Out"
            type="button"
          >
            <FiMinus size={20} />
          </button>
          <span className="px-2 py-1 text-xs font-bold rounded bg-[#334155] text-blue-300 select-none">
            {Math.round(effectiveScale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={zoom >= 2}
            className="p-2 text-blue-300 bg-[#1e293b] rounded hover:text-blue-500 transition disabled:opacity-40"
            aria-label="Zoom In"
            type="button"
          >
            <FiPlus size={20} />
          </button>
          <button
            className="p-2 text-blue-300 bg-[#1e293b] rounded hover:text-blue-500 transition"
            title="Download"
            onClick={() => window.open(fileUrl, "_blank")}
          >
            <FiDownload size={20} />
          </button>
          <button
            className="p-2 text-blue-300 bg-[#1e293b] rounded hover:text-blue-500 transition"
            title="Print"
            onClick={() => window.open(fileUrl, "_blank")}
          >
            <FiPrinter size={20} />
          </button>
          <button
            className="p-2 text-blue-300 bg-[#1e293b] rounded hover:text-blue-500 transition"
            title="Share"
            onClick={() =>
              navigator.share
                ? navigator.share({ url: fileUrl })
                : window.open(fileUrl)
            }
          >
            <FiShare2 size={20} />
          </button>
          <button
            className="p-2 text-blue-300 bg-[#1e293b] rounded hover:text-blue-500 transition"
            title="Fullscreen"
            onClick={() =>
              document.documentElement.requestFullscreen &&
              document.documentElement.requestFullscreen()
            }
          >
            <FiMaximize2 size={20} />
          </button>
        </div>
        <div className="flex items-center gap-3 text-blue-400">
          <span>
            <span className="bg-[#1e293b] px-2 py-1 rounded font-semibold">
              {pageNumber}
            </span>{" "}
            <span className="text-gray-400">of</span>{" "}
            <span className="bg-[#1e293b] px-2 py-1 rounded font-semibold">
              {numPages}
            </span>
          </span>
        </div>
      </div>

      {/* PDF Center Card */}
      <div className="flex-1 flex items-center justify-center w-full h-full p-4 overflow-auto">
        <div
          className="bg-[#181a20] shadow-2xl rounded-xl mx-auto flex items-center justify-center"
          style={{
            minWidth: 250,
            maxWidth: 800,
            padding: "1.5rem 0.5rem",
            border: "2px solid #272a36",
          }}
        >
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="text-center text-gray-400">Loading PDF...</div>
            }
            options={pdfOptions}
          >
            <Page
              pageNumber={pageNumber}
              scale={effectiveScale}
              onLoadSuccess={onPageLoadSuccess}
              loading={
                <div className="text-center text-gray-400">Loading Page...</div>
              }
              className="shadow-lg rounded-lg bg-white"
            />
          </Document>
        </div>
      </div>
    </div>
  );
}
