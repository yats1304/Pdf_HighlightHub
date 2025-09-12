import React from "react";
import Link from "next/link";
import {
  FiDownload,
  FiPrinter,
  FiShare2,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
  FiMaximize2,
  FiArrowUpLeft,
} from "react-icons/fi";

interface ToolbarProps {
  pageNumber: number;
  numPages: number;
  fileName?: string;
  fileSize?: string;
  zoom: number;
  baseScale: number;
  effectiveScale: number;
  changePage: (offset: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fileUrl: string;
  highlightsCount: number; // added
  onUndoHighlight: () => void; // added
}

function humanFileSize(size?: string) {
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

export default function Toolbar({
  pageNumber,
  numPages,
  fileName,
  fileSize,
  zoom,
  baseScale,
  effectiveScale,
  changePage,
  zoomIn,
  zoomOut,
  fileUrl,
  highlightsCount, // added
  onUndoHighlight, // added
}: ToolbarProps) {
  return (
    <div
      className={`
          w-full max-w-5xl mx-auto flex flex-wrap sm:flex-nowrap
          items-center justify-between gap-2
          px-2 sm:px-6 py-2 sm:py-4
          bg-[#242630] bg-opacity-95 shadow-lg rounded-xl mt-2 sm:mt-7
          sticky top-0 left-0 z-20
        `}
    >
      <div className="flex items-center gap-2 min-w-0">
        {/* Back to Dashboard Button */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition"
          aria-label="Back to Dashboard"
        >
          <FiArrowUpLeft size={18} />
          <span className="hidden xs:inline sm:inline">Dashboard</span>
        </Link>
        <FiArrowLeft
          size={22}
          className="text-gray-300 hover:text-blue-500 cursor-pointer"
          onClick={() => changePage(-1)}
          style={{
            opacity: pageNumber <= 1 ? 0.5 : 1,
            pointerEvents: pageNumber <= 1 ? "none" : "auto",
          }}
        />
        <FiArrowRight
          size={22}
          className="text-gray-300 hover:text-blue-500 cursor-pointer"
          onClick={() => changePage(1)}
          style={{
            opacity: pageNumber >= numPages ? 0.5 : 1,
            pointerEvents: pageNumber >= numPages ? "none" : "auto",
          }}
        />
        <span
          className="ml-2 px-2 py-1 rounded font-semibold bg-[#1e293b] text-blue-400 truncate hidden sm:inline-block"
          style={{ maxWidth: 140 }}
        >
          {fileName}
        </span>
        <span
          className="ml-2 text-xs text-gray-400 opacity-90 truncate hidden sm:inline-block"
          style={{ maxWidth: 80 }}
        >
          PDF {fileSize && `| ${humanFileSize(fileSize)}`}
        </span>
      </div>
      {/* Controls */}
      <div className="flex flex-row flex-wrap gap-1 items-center justify-end">
        <button
          onClick={zoomOut}
          disabled={zoom <= baseScale}
          className="p-2 text-blue-300 bg-[#1e293b] rounded hover:text-blue-500 transition disabled:opacity-40"
          aria-label="Zoom Out"
          type="button"
        >
          <FiMinus size={20} />
        </button>
        <span className="px-2 py-1 text-xs font-bold rounded bg-[#334155] text-blue-300 select-none min-w-[45px] text-center">
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

        {/* Undo Highlight Button */}
        <button
          onClick={onUndoHighlight}
          disabled={highlightsCount === 0}
          className="p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          title="Undo last highlight"
          type="button"
        >
          Undo
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
        <span className="px-2 py-1 ml-1 rounded bg-[#1e293b] text-blue-400 font-semibold min-w-[56px] text-center text-sm">
          {pageNumber} <span className="text-gray-400">of</span> {numPages}
        </span>
      </div>
    </div>
  );
}
