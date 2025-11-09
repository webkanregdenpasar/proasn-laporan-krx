import "./globals.css";
import React from "react";

export const metadata = {
  title: "ProASN Minutes",
  description: "Record and print ProASN minutes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto py-6 px-4">{children}</div>
      </body>
    </html>
  );
}
