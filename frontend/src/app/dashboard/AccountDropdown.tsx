"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="bg-gray-800/80 text-gray-200 px-5 py-2 rounded shadow hover:underline hover:bg-gray-700 transition font-semibold"
      >
        My Account
      </button>
      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-gray-700 bg-opacity-95 rounded-lg shadow-xl border border-gray-600 z-20">
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white rounded-b-lg font-semibold"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
