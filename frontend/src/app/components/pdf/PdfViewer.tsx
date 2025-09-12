"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import Toolbar from "./Toolbar";
import PdfPageHighlights from "./PdfPageWithHighlights";
import useWindowSize from "../../hooks/useWindowSize";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

interface Highlight {
  id: string;
  pageNumber: number;
  rects: { top: number; left: number; width: number; height: number }[];
  text: string;
}

interface PdfViewerProps {
  fileUrl: string;
  fileName?: string;
  fileSize?: string;
  className?: string;
  onChangePage?: (page: number) => void;
}

export default function PdfViewer({
  fileUrl,
  fileName,
  fileSize,
  className,
  onChangePage,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [pageDimensions, setPageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const windowSize = useWindowSize();

  const pdfOptions = useMemo(
    () => ({
      cMapUrl: "cmaps/",
      cMapPacked: true,
    }),
    []
  );

  const pdfPageRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setPageNumber(1);
      if (onChangePage) onChangePage(1);
    },
    [onChangePage]
  );

  const onPageLoadSuccess = useCallback((page: any) => {
    setPageDimensions({
      width: page.originalWidth,
      height: page.originalHeight,
    });
  }, []);

  const changePage = useCallback(
    (offset: number) => {
      setPageNumber((current) => {
        const newPage = Math.min(Math.max(current + offset, 1), numPages);
        if (onChangePage) onChangePage(newPage);
        return newPage;
      });
    },
    [numPages, onChangePage]
  );

  const zoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.2, 2)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(z - 0.2, 0.5)), []);

  const padding = 32;
  const toolbarHeight = 76;
  const viewportWidth = windowSize?.width || 600;
  const viewportHeight = windowSize?.height || 800;
  const maxWidth = viewportWidth - padding * 2;
  const maxHeight = viewportHeight - toolbarHeight - padding * 2;

  let baseScale = 1;
  if (pageDimensions) {
    baseScale = Math.min(
      maxWidth / pageDimensions.width,
      maxHeight / pageDimensions.height,
      1
    );
  }
  const effectiveScale = baseScale * zoom;

  const handleHighlightSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;

    const text = sel.toString().trim();
    if (text.length === 0) return;
    if (!pdfPageRef.current) return;

    const range = sel.getRangeAt(0);
    const containerRect = pdfPageRef.current.getBoundingClientRect();

    const rects: {
      top: number;
      left: number;
      width: number;
      height: number;
    }[] = [];

    for (let i = 0; i < range.getClientRects().length; i++) {
      const r = range.getClientRects()[i];
      rects.push({
        top:
          (r.top - containerRect.top + pdfPageRef.current.scrollTop) /
          effectiveScale,
        left:
          (r.left - containerRect.left + pdfPageRef.current.scrollLeft) /
          effectiveScale,
        width: r.width / effectiveScale,
        height: r.height / effectiveScale,
      });
    }

    if (rects.length === 0) return;

    setHighlights((current) => [
      ...current,
      { id: Date.now().toString(), pageNumber, rects, text },
    ]);
    sel.removeAllRanges();
  }, [pageNumber, effectiveScale]);

  if (!fileUrl) {
    return <div className="text-center p-6 text-red-500">No PDF loaded</div>;
  }

  return (
    <div
      className={`fixed inset-0 z-10 flex flex-col bg-[#222] min-h-full min-w-full ${className}`}
    >
      <Toolbar
        pageNumber={pageNumber}
        numPages={numPages}
        fileName={fileName}
        fileSize={fileSize}
        zoom={zoom}
        baseScale={baseScale}
        effectiveScale={effectiveScale}
        changePage={changePage}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        fileUrl={fileUrl}
        highlightsCount={highlights.length} // Pass highlight count
        onUndoHighlight={() => setHighlights(highlights.slice(0, -1))} // Pass undo function
      />
      <div
        className="flex-1 overflow-auto flex justify-center items-start p-4"
        style={{ minHeight: 0 }}
      >
        <PdfPageHighlights
          fileUrl={fileUrl}
          pageNumber={pageNumber}
          scale={effectiveScale}
          pdfOptions={pdfOptions}
          onPageLoadSuccess={onPageLoadSuccess}
          highlights={highlights}
          pageContainerRef={pdfPageRef}
          handleTextSelection={handleHighlightSelection}
        />
      </div>
    </div>
  );
}
