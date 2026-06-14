import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Loud Alarm",
  description: "Privacy policy for the Loud Alarm iOS app",
};

export default function PrivacyPolicy() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy — Loud Alarm</h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: May 22, 2026</p>

      <p className="mb-4">
        Loud Alarm does not collect, store, or transmit any personal data.
      </p>

      <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
        <li>No analytics</li>
        <li>No advertising identifiers</li>
        <li>No personal information</li>
        <li>No network requests</li>
        <li>No third-party SDKs</li>
      </ul>

      <p className="mb-6">
        The app operates entirely on-device. Subscription management is handled
        by Apple through the App Store.
      </p>

      <p className="text-gray-600">
        <strong>Contact:</strong>{" "}
        <a href="mailto:jeff@ripxg.com" className="underline">
          jeff@ripxg.com
        </a>
      </p>
    </main>
  );
}
