"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  name?: string;
  email?: string;
}

interface AccountDropdownProps {
  user: User | null;
}

export default function AccountDropdown({ user }: AccountDropdownProps) {
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
      {open && user && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg z-20">
          <div className="p-4 border-b border-gray-700">
            <p className="text-white font-semibold">{user.name || "User"}</p>
            <p className="text-gray-400 text-sm truncate">{user.email}</p>
          </div>
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
