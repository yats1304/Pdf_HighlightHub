"use client";

import React from "react";
import AccountDropdown from "./AccountDropdown";

interface User {
  name?: string;
  email?: string;
}

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 relative">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 sm:mb-0 drop-shadow">
        Dashboard
      </h1>
      <AccountDropdown />
    </header>
  );
}
