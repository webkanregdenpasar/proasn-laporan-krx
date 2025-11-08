// app/layout.tsx
import "./globals.css";
import React from "react";

export const metadata = {
  title: "ProASN Minutes",
  description: "Minutes recording system for ProASN events",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto py-6">{children}</div>
      </body>
    </html>
  );
}
