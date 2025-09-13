"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      setLoading(false);
      router.push("/dashboard");
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 sm:px-12 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Particle background for visual consistency */}
        <form
          onSubmit={handleLogin}
          className="relative z-10 max-w-md w-full mx-auto bg-gray-800 bg-opacity-80 p-8 rounded-xl shadow-xl"
        >
          <h2 className="text-2xl font-extrabold text-white mb-6 text-center">
            Login to your account
          </h2>
          {error && (
            <div className="mb-4 p-2 bg-red-500 bg-opacity-40 text-red-100 rounded font-semibold text-center">
              {error}
            </div>
          )}

          <label className="block mb-2 font-semibold text-gray-200">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-700 rounded px-3 py-2 mb-4 focus:outline-none bg-gray-900 text-gray-100"
          />

          <label className="block mb-2 font-semibold text-gray-200">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-700 rounded px-3 py-2 mb-6 focus:outline-none bg-gray-900 text-gray-100"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-6 text-center text-gray-300">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-400 hover:underline font-semibold"
            >
              Create it
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
