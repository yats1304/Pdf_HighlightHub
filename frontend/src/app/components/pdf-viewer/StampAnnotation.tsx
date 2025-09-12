import React, { useState } from "react";
import { StampAnnotation as StampAnnotationType } from "@/types/annotations";

interface StampAnnotationProps {
  annotation: StampAnnotationType;
  scale: number;
  onDelete: (id: string) => void;
  onUpdate: (annotation: StampAnnotationType) => void;
}

const STAMP_STYLES = {
  approved: {
    bg: "bg-green-100",
    border: "border-green-600",
    text: "text-green-700",
    label: "APPROVED",
  },
  rejected: {
    bg: "bg-red-100",
    border: "border-red-600",
    text: "text-red-700",
    label: "REJECTED",
  },
  reviewed: {
    bg: "bg-blue-100",
    border: "border-blue-600",
    text: "text-blue-700",
    label: "REVIEWED",
  },
  confidential: {
    bg: "bg-orange-100",
    border: "border-orange-600",
    text: "text-orange-700",
    label: "CONFIDENTIAL",
  },
  custom: {
    bg: "bg-purple-100",
    border: "border-purple-600",
    text: "text-purple-700",
    label: "CUSTOM",
  },
};

export default function StampAnnotation({
  annotation,
  scale,
  onDelete,
  onUpdate,
}: StampAnnotationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [customText, setCustomText] = useState(annotation.customText || "");

  const stampStyle = STAMP_STYLES[annotation.stampType];
  const displayText =
    annotation.stampType === "custom" && annotation.customText
      ? annotation.customText
      : stampStyle.label;

  const handleDoubleClick = () => {
    if (annotation.stampType === "custom") {
      setIsEditing(true);
    } else {
      if (confirm("Delete this stamp?")) {
        onDelete(annotation.id);
      }
    }
  };

  const handleSave = () => {
    onUpdate({
      ...annotation,
      customText,
      updatedAt: new Date(),
    });
    setIsEditing(false);
  };

  return (
    <div
      className="absolute z-10"
      style={{
        left: annotation.x * scale,
        top: annotation.y * scale,
        transform: "translate(-50%, -50%)",
        rotate: `${annotation.rotation}deg`,
      }}
    >
      {isEditing ? (
        <div className="bg-white border-2 border-purple-600 rounded-lg p-2">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-24 text-xs text-center border border-gray-300 rounded px-1"
            placeholder="Text"
            autoFocus
            onBlur={handleSave}
            onKeyPress={(e) => e.key === "Enter" && handleSave()}
          />
        </div>
      ) : (
        <div
          className={`
            px-2 py-1 border-2 rounded cursor-pointer font-bold text-xs text-center
            ${stampStyle.bg} ${stampStyle.border} ${stampStyle.text}
            hover:opacity-80 transform hover:scale-105 transition-all
            select-none
          `}
          style={{
            width: annotation.width * scale,
            height: annotation.height * scale,
            minWidth: "60px",
            minHeight: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onDoubleClick={handleDoubleClick}
          title={
            annotation.stampType === "custom"
              ? "Double-click to edit"
              : "Double-click to delete"
          }
        >
          {displayText}
        </div>
      )}
    </div>
  );
}
