"use client";

import React, { useState, useEffect } from "react";
import Header from "./Header";
import PdfList from "./PdfList";
import ActivityList from "./ActivityList";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface PDF {
  id: string;
  name: string;
  status: string;
  uploaded: string;
  thumbnail?: string;
}

interface Activity {
  id: string | number;
  message: string;
  file: string;
  when: string;
}

interface User {
  name: string;
  email: string;
}

export default function Dashboard() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  // Initial data fetch only
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view the dashboard.");
        setLoading(false);
        return;
      }

      const [pdfsRes, activityRes] = await Promise.all([
        fetch(`${API_BASE_URL}api/pdfs`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/activity`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!pdfsRes.ok || !activityRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const rawPdfs = await pdfsRes.json();
      const rawActivities = await activityRes.json();

      const mappedPdfs = rawPdfs.map((pdf: any) => ({
        id: pdf._id || pdf.id,
        name: pdf.originalName || pdf.name || "Untitled PDF",
        status: "Ready", // Changed from "Pending" to "Ready" or remove status altogether
        uploaded: pdf.uploadDate || pdf.uploaded || new Date().toISOString(),
        thumbnail: pdf.thumbnail || undefined,
      }));

      const mappedActivity = rawActivities.map((act: any) => ({
        id: act._id || act.id || Math.random().toString(),
        message: act.message || "Activity",
        file: act.file || act.text || "Unknown",
        when:
          act.when ||
          (act.createdAt
            ? new Date(act.createdAt).toLocaleDateString()
            : "Unknown Date"),
      }));

      setPdfs(mappedPdfs);
      setActivity(mappedActivity);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Incremental removal on delete without full fetch
  const handleDeletePdf = async (pdfId: string) => {
    if (!confirm("Are you sure you want to delete this PDF?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/pdfs/${pdfId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete PDF");

      setPdfs((prev) => prev.filter((pdf) => pdf.id !== pdfId));
    } catch (err: any) {
      alert("Error deleting PDF: " + (err.message || "Unknown error"));
    }
  };

  // Incremental addition on upload without full fetch
  const handleUploadSuccess = (newPdf: PDF) => {
    setPdfs((prev) => [newPdf, ...prev]);
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading dashboard...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
      <Header user={user} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <PdfList
          pdfs={pdfs}
          onUploadSuccess={handleUploadSuccess}
          onDeletePdf={handleDeletePdf}
        />
        <ActivityList activity={activity} />
      </div>
    </div>
  );
}
