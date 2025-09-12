import React from "react";
import { ShapeAnnotation as ShapeAnnotationType } from "@/types/annotations";

interface ShapeAnnotationProps {
  annotation: ShapeAnnotationType;
  scale: number;
  onDelete: (id: string) => void;
}

export default function ShapeAnnotation({
  annotation,
  scale,
  onDelete,
}: ShapeAnnotationProps) {
  const startX = annotation.startX * scale;
  const startY = annotation.startY * scale;
  const endX = annotation.endX * scale;
  const endY = annotation.endY * scale;

  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);

  const handleDoubleClick = () => {
    if (confirm("Delete this annotation?")) {
      onDelete(annotation.id);
    }
  };

  const renderShape = () => {
    switch (annotation.type) {
      case "rectangle":
        return (
          <div
            className="absolute border-2 cursor-pointer hover:opacity-80"
            style={{
              left,
              top,
              width,
              height,
              borderColor: annotation.strokeColor,
              backgroundColor: annotation.fillColor || "transparent",
              borderWidth: annotation.strokeWidth,
            }}
            onDoubleClick={handleDoubleClick}
            title="Double-click to delete"
          />
        );

      case "circle":
        return (
          <div
            className="absolute border-2 rounded-full cursor-pointer hover:opacity-80"
            style={{
              left,
              top,
              width,
              height,
              borderColor: annotation.strokeColor,
              backgroundColor: annotation.fillColor || "transparent",
              borderWidth: annotation.strokeWidth,
            }}
            onDoubleClick={handleDoubleClick}
            title="Double-click to delete"
          />
        );

      case "arrow":
        const arrowHeadSize = 10;

        return (
          <div
            className="absolute cursor-pointer hover:opacity-80"
            style={{
              left: Math.min(startX, endX) - arrowHeadSize,
              top: Math.min(startY, endY) - arrowHeadSize,
              width: width + arrowHeadSize * 2,
              height: height + arrowHeadSize * 2,
            }}
            onDoubleClick={handleDoubleClick}
            title="Double-click to delete"
          >
            <svg width="100%" height="100%" style={{ pointerEvents: "none" }}>
              <defs>
                <marker
                  id={`arrowhead-${annotation.id}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill={annotation.strokeColor}
                  />
                </marker>
              </defs>
              <line
                x1={startX - Math.min(startX, endX) + arrowHeadSize}
                y1={startY - Math.min(startY, endY) + arrowHeadSize}
                x2={endX - Math.min(startX, endX) + arrowHeadSize}
                y2={endY - Math.min(startY, endY) + arrowHeadSize}
                stroke={annotation.strokeColor}
                strokeWidth={annotation.strokeWidth}
                markerEnd={`url(#arrowhead-${annotation.id})`}
              />
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  return renderShape();
}
