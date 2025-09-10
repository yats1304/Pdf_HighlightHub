"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignupPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation helper functions
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isStrongPassword = (pwd: string) =>
    pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validations
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters long, contain a number and an uppercase letter."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push("/login");
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 sm:px-12 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <form
        onSubmit={handleSignup}
        className="relative z-10 max-w-md w-full bg-gray-800 bg-opacity-80 p-8 rounded-xl shadow-xl"
        noValidate
      >
        <h2 className="text-2xl font-extrabold text-white mb-6 text-center">
          Create an account
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-500 bg-opacity-40 text-red-100 rounded font-semibold text-center">
            {error}
          </div>
        )}

        <label className="block mb-2 font-semibold text-gray-200">Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-700 rounded px-3 py-2 mb-4 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Your full name"
        />

        <label className="block mb-2 font-semibold text-gray-200">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-700 rounded px-3 py-2 mb-4 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="you@example.com"
        />

        <label className="block mb-2 font-semibold text-gray-200">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-700 rounded px-3 py-2 mb-4 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="At least 8 chars, number & uppercase"
        />

        <label className="block mb-2 font-semibold text-gray-200">
          Confirm Password
        </label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-700 rounded px-3 py-2 mb-6 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Repeat your password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="mt-6 text-center text-gray-300">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:underline font-semibold"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
