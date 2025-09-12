import React from "react";
import { TextMarkupAnnotation } from "@/types/annotations";

interface TextMarkupProps {
  annotation: TextMarkupAnnotation;
  scale: number;
  onDelete: (id: string) => void;
}

export default function TextMarkup({
  annotation,
  scale,
  onDelete,
}: TextMarkupProps) {
  const handleDoubleClick = () => {
    if (confirm("Delete this markup?")) {
      onDelete(annotation.id);
    }
  };

  return (
    <>
      {annotation.rects.map((rect, idx) => (
        <div
          key={`${annotation.id}-${idx}`}
          className="absolute cursor-pointer hover:opacity-80"
          style={{
            left: rect.left * scale,
            top: rect.top * scale,
            width: rect.width * scale,
            height: rect.height * scale,
            ...(annotation.type === "underline"
              ? {
                  borderBottom: `2px solid ${annotation.color}`,
                  bottom: rect.top * scale + rect.height * scale - 2,
                }
              : {
                  // Strikethrough
                  borderTop: `2px solid ${annotation.color}`,
                  top: rect.top * scale + (rect.height * scale) / 2,
                  height: 0,
                }),
          }}
          onDoubleClick={handleDoubleClick}
          title="Double-click to delete"
        />
      ))}
    </>
  );
}
