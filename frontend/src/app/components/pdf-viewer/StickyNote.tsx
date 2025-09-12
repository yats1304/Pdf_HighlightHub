import React, { useState, useRef, useEffect } from "react";
import { FiX, FiEdit3, FiCheck } from "react-icons/fi";
import { NoteAnnotation } from "@/types/annotations";

interface StickyNoteProps {
  annotation: NoteAnnotation;
  scale: number;
  onUpdate: (annotation: NoteAnnotation) => void;
  onDelete: (id: string) => void;
}

export default function StickyNote({
  annotation,
  scale,
  onUpdate,
  onDelete,
}: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(!annotation.content);
  const [content, setContent] = useState(annotation.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onUpdate({ ...annotation, content, updatedAt: new Date() });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (!annotation.content) {
      onDelete(annotation.id);
    } else {
      setContent(annotation.content);
      setIsEditing(false);
    }
  };

  // Position relative to the PDF page
  const noteStyle = {
    position: "absolute" as const,
    left: `${annotation.x * scale}px`,
    top: `${annotation.y * scale}px`,
    transform: "translate(-12px, -12px)",
    zIndex: 50,
  };

  return (
    <div style={noteStyle}>
      {/* Note Icon */}
      <div
        className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-600 cursor-pointer flex items-center justify-center hover:bg-yellow-500 transition-all shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
          onUpdate({ ...annotation, isOpen: !annotation.isOpen });
        }}
      >
        <div className="w-2 h-2 bg-yellow-700 rounded-full" />
      </div>

      {/* Note Content */}
      {annotation.isOpen && (
        <div
          className="absolute top-8 left-0 w-64 bg-yellow-50 border-2 border-yellow-400 rounded-lg shadow-xl"
          style={{ transform: "translateX(-50%)", zIndex: 60 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-3">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-yellow-800 text-sm">Note</h4>
              <div className="flex gap-1">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 hover:bg-yellow-200 rounded transition-colors"
                    title="Edit"
                  >
                    <FiEdit3 size={12} className="text-yellow-700" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(annotation.id)}
                  className="p-1 hover:bg-yellow-200 rounded transition-colors"
                  title="Delete"
                >
                  <FiX size={12} className="text-yellow-700" />
                </button>
              </div>
            </div>

            {isEditing ? (
              <div>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-20 p-2 text-sm border border-yellow-400 rounded resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
                  placeholder="Add your note..."
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-1 transition-colors"
                  >
                    <FiCheck size={10} />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-yellow-800 whitespace-pre-wrap mb-2">
                  {annotation.content || "Click to add note..."}
                </p>
                <div className="text-xs text-yellow-600 border-t border-yellow-300 pt-2">
                  {new Date(annotation.createdAt).toLocaleDateString()}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
