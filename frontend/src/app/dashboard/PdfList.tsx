"use client";

import React from "react";
import Link from "next/link";

interface PDF {
  id: string;
  name: string;
  status: string;
  uploaded: string;
  thumbnail?: string;
}

interface PdfListProps {
  pdfs: PDF[];
}

export default function PdfList({ pdfs }: PdfListProps) {
  return (
    <section className="bg-gray-800/90 col-span-2 rounded-xl shadow-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-100">My PDFs</h2>
        <Link href="/upload">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-semibold shadow">
            + Upload PDF
          </button>
        </Link>
      </div>
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
              <button className="bg-gray-700 px-3 py-2 rounded text-gray-300 hover:bg-red-600 hover:text-white transition font-semibold">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
