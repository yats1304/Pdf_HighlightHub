import React, { useState } from "react";
import {
  FiEdit,
  FiMessageSquare,
  FiMinus,
  FiSquare,
  FiCircle,
  FiNavigation,
  FiStar,
  FiUnderline,
} from "react-icons/fi";
import { MdPalette } from "react-icons/md"; // Use Material Design icon for palette
import { AnnotationType } from "@/types/annotations";

interface AnnotationToolbarProps {
  selectedTool: AnnotationType | null;
  onToolSelect: (tool: AnnotationType | null) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
}

const COLORS = [
  "#FFFF00", // Yellow
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEAA7", // Light Yellow
  "#DDA0DD", // Plum
  "#FFA07A", // Light Salmon
];

export default function AnnotationToolbar({
  selectedTool,
  onToolSelect,
  selectedColor,
  onColorChange,
  strokeWidth,
  onStrokeWidthChange,
}: AnnotationToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokeOptions, setShowStrokeOptions] = useState(false);

  const tools = [
    { type: "highlight" as AnnotationType, icon: FiEdit, label: "Highlight" },
    {
      type: "note" as AnnotationType,
      icon: FiMessageSquare,
      label: "Sticky Note",
    },
    {
      type: "underline" as AnnotationType,
      icon: FiUnderline,
      label: "Underline",
    },
    {
      type: "strikethrough" as AnnotationType,
      icon: FiMinus,
      label: "Strikethrough",
    },
    { type: "rectangle" as AnnotationType, icon: FiSquare, label: "Rectangle" },
    { type: "circle" as AnnotationType, icon: FiCircle, label: "Circle" },
    { type: "arrow" as AnnotationType, icon: FiNavigation, label: "Arrow" },
    { type: "stamp" as AnnotationType, icon: FiStar, label: "Stamp" },
  ];

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg mb-2">
      {/* Tool Buttons */}
      {tools.map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          onClick={() => onToolSelect(selectedTool === type ? null : type)}
          className={`
            p-2 rounded transition-colors ${
              selectedTool === type
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }
          `}
          title={label}
        >
          <Icon size={18} />
        </button>
      ))}

      {/* Color Picker */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          title="Choose Color"
        >
          <div className="flex items-center gap-2">
            <MdPalette size={18} className="text-gray-300" />
            <div
              className="w-4 h-4 rounded border border-gray-600"
              style={{ backgroundColor: selectedColor }}
            />
          </div>
        </button>

        {showColorPicker && (
          <div className="absolute top-12 left-0 p-2 bg-gray-800 rounded-lg shadow-lg z-50">
            <div className="grid grid-cols-4 gap-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onColorChange(color);
                    setShowColorPicker(false);
                  }}
                  className={`
                    w-6 h-6 rounded border-2 transition-all ${
                      selectedColor === color
                        ? "border-white scale-110"
                        : "border-gray-600 hover:border-gray-400"
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stroke Width for Drawing Tools */}
      {["rectangle", "circle", "arrow"].includes(selectedTool as string) && (
        <div className="relative">
          <button
            onClick={() => setShowStrokeOptions(!showStrokeOptions)}
            className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-gray-300"
            title="Stroke Width"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{strokeWidth}px</span>
            </div>
          </button>

          {showStrokeOptions && (
            <div className="absolute top-12 left-0 p-2 bg-gray-800 rounded-lg shadow-lg z-50">
              <div className="flex flex-col gap-1">
                {[1, 2, 3, 4, 5].map((width) => (
                  <button
                    key={width}
                    onClick={() => {
                      onStrokeWidthChange(width);
                      setShowStrokeOptions(false);
                    }}
                    className={`
                      px-3 py-1 text-sm rounded transition-colors ${
                        strokeWidth === width
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-700"
                      }
                    `}
                  >
                    {width}px
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedTool && (
        <div className="ml-2 px-2 py-1 bg-blue-600 text-white text-sm rounded">
          {tools.find((t) => t.type === selectedTool)?.label} Mode
        </div>
      )}
    </div>
  );
}
