"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("../../components/pdf/PdfViewer"), {
  ssr: false,
});

export default function PdfDetailPage() {
  const params = useParams();
  const pdfId = params?.id;

  const [fileUrl, setFileUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pdfId) return;

    async function fetchPdf() {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`http://localhost:5000/api/pdfs/${pdfId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch PDF");

        const pdf = await res.json();

        setFileUrl(`http://localhost:5000/uploads/${pdf.filename}`);
      } catch (e: any) {
        setError(e.message || "Error loading PDF");
        setFileUrl("");
      } finally {
        setLoading(false);
      }
    }

    fetchPdf();
  }, [pdfId]);

  if (loading) return <div className="text-center p-6">Loading PDF...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
  if (!fileUrl) return <div className="text-center p-6">PDF not found</div>;

  return (
    <div className="p-8">
      <PdfViewer fileUrl={fileUrl} />
    </div>
  );
}
