import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Text Video Studio", description: "Make animated text explainer videos" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
