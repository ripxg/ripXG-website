"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { sendLeadEmail } from "@/lib/emailjs";

type FormState = "idle" | "submitting" | "success" | "error";

const USE_CASES = [
  {
    id: "ai-website",
    emoji: "🌐",
    title: "AI-Managed Website",
    subtitle: "Your site, your control — zero agency fees",
    description:
      "Get the exact same stack powering ripXG.com. Your AI assistant manages content, deploys updates, and handles the day-to-day — you just share ideas. Live in minutes, not weeks.",
  },
  {
    id: "ai-marketing",
    emoji: "📣",
    title: "Always-On Marketing",
    subtitle: "Automated social content that never sleeps",
    description:
      "Nova — our AI marketing agent — researches your niche, generates scroll-stopping content, and posts across TikTok, Instagram, and more on a schedule. Your brand stays visible without lifting a finger.",
  },
  {
    id: "ai-comms",
    emoji: "💬",
    title: "Inbound Communications",
    subtitle: "Every enquiry handled, nothing missed",
    description:
      "Your AI manages inbound messages across email, WhatsApp, and social DMs. It qualifies leads, answers common questions, books meetings, and escalates when a human touch is needed.",
  },
];

export default function GetStartedPage() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "" });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleUseCase = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;

    setState("submitting");
    setErrorMsg("");

    const selectedLabels = USE_CASES.filter((uc) => selected.has(uc.id)).map(
      (uc) => uc.title
    );

    try {
      await sendLeadEmail({
        name: form.name,
        email: form.email,
        useCases: selectedLabels,
      });

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
            Tell me what you want to automate — I&apos;ll reach out with a plan.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Use Case Selector */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What would you like AI to handle?{" "}
                <span className="text-gray-400 font-normal">
                  (select all that apply)
                </span>
              </p>

              {/* Horizontal scroll strip */}
              <div className="relative">
                {/* Fade hints on sides */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white dark:from-purple-900 to-transparent z-10 rounded-l-xl" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white dark:from-purple-900 to-transparent z-10 rounded-r-xl" />

                <div
                  ref={scrollRef}
                  className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {USE_CASES.map((uc) => {
                    const isSelected = selected.has(uc.id);
                    return (
                      <button
                        key={uc.id}
                        type="button"
                        onClick={() => toggleUseCase(uc.id)}
                        className={`
                          flex-shrink-0 snap-start w-64 text-left rounded-xl border-2 p-5 transition-all duration-200 cursor-pointer
                          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500
                          ${
                            isSelected
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-800 shadow-md"
                              : "border-purple-200 dark:border-purple-700 bg-white dark:bg-purple-950 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-sm"
                          }
                        `}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-2xl">{uc.emoji}</span>
                          <span
                            className={`
                              w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors
                              ${
                                isSelected
                                  ? "border-purple-500 bg-purple-500"
                                  : "border-gray-300 dark:border-purple-600"
                              }
                            `}
                          >
                            {isSelected && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </span>
                        </div>
                        <h3
                          className={`font-semibold text-base mb-1 ${
                            isSelected
                              ? "text-purple-700 dark:text-purple-200"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {uc.title}
                        </h3>
                        <p className="text-xs font-medium text-gold-600 dark:text-gold-400 mb-2">
                          {uc.subtitle}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                          {uc.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scroll dots indicator */}
              <div className="flex justify-center gap-2 mt-3">
                {USE_CASES.map((uc) => (
                  <div
                    key={uc.id}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      selected.has(uc.id)
                        ? "w-4 bg-purple-500"
                        : "w-1.5 bg-purple-200 dark:bg-purple-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Name */}
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

            {/* Email */}
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
