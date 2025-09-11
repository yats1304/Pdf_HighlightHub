"use client";

import Link from "next/link";
import React, { useRef, useState } from "react";

interface PDF {
  id: string;
  name: string;
  status: string;
  uploaded: string;
  thumbnail?: string;
}

interface PdfListProps {
  pdfs: PDF[];
  onUploadSuccess?: (newPdf: PDF) => void; // Updated: accepts PDF object
  onDeletePdf?: (pdfId: string) => void;
}

export default function PdfList({
  pdfs,
  onUploadSuccess,
  onDeletePdf,
}: PdfListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated.");

      const formData = new FormData();
      formData.append("pdf", file);

      const res = await fetch("http://localhost:5000/api/pdfs/uploads", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Upload failed");
      }

      const uploadedPdf = await res.json();

      if (fileInputRef.current) fileInputRef.current.value = "";

      // Pass uploaded PDF info up to parent
      onUploadSuccess &&
        onUploadSuccess({
          id: uploadedPdf.pdfId,
          name: uploadedPdf.originalName,
          status: "Pending",
          uploaded: new Date().toISOString(),
          thumbnail: "",
        });
    } catch (err: any) {
      setUploadError(err.message || "Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (pdfId: string) => {
    if (!confirm("Are you sure you want to delete this PDF?")) return;
    onDeletePdf && onDeletePdf(pdfId);
  };

  return (
    <section className="bg-gray-800/90 col-span-2 rounded-xl shadow-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-100">My PDFs</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-semibold shadow disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "+ Upload PDF"}
          </button>
          {uploadError && (
            <p className="text-red-500 text-sm ml-4 mt-1 sm:mt-0">
              {uploadError}
            </p>
          )}
        </div>
      </div>

      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <ul>
        {pdfs.length === 0 && (
          <p className="text-gray-400 text-center italic py-10">
            No PDFs uploaded yet. Start by uploading one!
          </p>
        )}
        {pdfs.map((pdf) => (
          <li
            key={pdf.id}
            className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gray-900/90 rounded-xl mb-4 shadow"
          >
            <div className="flex items-center gap-3 w-full md:w-auto">
              <img
                src={
                  pdf.thumbnail ||
                  "https://static.thenounproject.com/png/3372115-200.png"
                }
                alt="PDF thumbnail"
                className="w-12 h-14 object-cover rounded border border-gray-800 bg-white"
              />
              <div>
                <div className="font-semibold text-gray-100 truncate">
                  {pdf.name}
                </div>
                <div className="text-gray-400 text-xs">
                  Uploaded: {new Date(pdf.uploaded).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  pdf.status === "Annotated"
                    ? "bg-green-600 text-white"
                    : "bg-yellow-400 text-gray-900"
                }`}
              >
                {pdf.status}
              </span>
              <Link href={`/pdfs/${pdf.id}`}>
                <button className="bg-blue-500 px-4 py-2 rounded text-white font-semibold hover:bg-blue-600 transition">
                  Annotate
                </button>
              </Link>
              <button
                onClick={() => handleDeleteClick(pdf.id)}
                className="bg-gray-700 px-3 py-2 rounded text-gray-300 hover:bg-red-600 hover:text-white transition font-semibold"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
