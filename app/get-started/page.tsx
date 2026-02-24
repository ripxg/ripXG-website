"use client";

import Link from "next/link";
import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export default function GetStartedPage() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;

    setState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-purple-950 dark:via-purple-900 dark:to-purple-950 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-balance">
            Got it!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-pretty">
            I&apos;ll be in touch soon.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center text-purple-600 dark:text-purple-400 hover:text-gold-500 dark:hover:text-gold-400 font-medium transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-purple-950 dark:via-purple-900 dark:to-purple-950">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="text-purple-600 dark:text-purple-400 hover:text-gold-500 dark:hover:text-gold-400 mb-8 inline-flex items-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 min-h-[44px]"
        >
          ← Back to home
        </Link>

        <div className="bg-white dark:bg-purple-900 rounded-2xl p-8 md:p-12 shadow-xl border-2 border-purple-200 dark:border-purple-800">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white text-balance">
            Let&apos;s work together.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-pretty">
            Tell me a bit about yourself and I&apos;ll be in touch.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Name <span className="text-gray-400">(optional)</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-purple-950 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-purple-950 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Message <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="What would you like to automate?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-purple-950 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-colors resize-none"
              />
            </div>

            {state === "error" && (
              <p className="text-red-500 text-sm">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={state === "submitting" || !form.email}
              className="w-full md:w-auto inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-gold-500 hover:from-purple-700 hover:to-gold-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all shadow-md hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 min-h-[44px]"
            >
              {state === "submitting" ? "Sending…" : "Send it →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
