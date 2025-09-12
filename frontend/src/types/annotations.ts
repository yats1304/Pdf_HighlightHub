export type AnnotationType =
  | "highlight"
  | "note"
  | "underline"
  | "strikethrough"
  | "rectangle"
  | "circle"
  | "arrow"
  | "stamp";

export interface BaseAnnotation {
  id: string;
  pageNumber: number;
  type: AnnotationType;
  createdAt: Date;
  updatedAt: Date;
  author?: string;
}

export interface HighlightAnnotation extends BaseAnnotation {
  type: "highlight";
  rects: { top: number; left: number; width: number; height: number }[];
  text: string;
  color: string;
}

export interface NoteAnnotation extends BaseAnnotation {
  type: "note";
  x: number;
  y: number;
  content: string;
  isOpen: boolean;
}

export interface TextMarkupAnnotation extends BaseAnnotation {
  type: "underline" | "strikethrough";
  rects: { top: number; left: number; width: number; height: number }[];
  text: string;
  color: string;
}

export interface ShapeAnnotation extends BaseAnnotation {
  type: "rectangle" | "circle" | "arrow";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  strokeColor: string;
  fillColor?: string;
  strokeWidth: number;
}

export interface StampAnnotation extends BaseAnnotation {
  type: "stamp";
  x: number;
  y: number;
  stampType: "approved" | "rejected" | "reviewed" | "confidential" | "custom";
  customText?: string;
  rotation: number;
  width: number;
  height: number;
}

export type Annotation =
  | HighlightAnnotation
  | NoteAnnotation
  | TextMarkupAnnotation
  | ShapeAnnotation
  | StampAnnotation;
