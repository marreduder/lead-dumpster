import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadDumpster",
  description: "Lead organization tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
