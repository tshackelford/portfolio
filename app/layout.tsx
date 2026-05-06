import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  weight: "variable",
  axes: ["opsz"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Thomas Shackelford — Senior Software Engineer",
  description:
    "Senior software engineer in Lakewood, CA. Thirteen years building accessible, high-performance web applications for fintech.",
  metadataBase: new URL("https://thomasshackelford.dev"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
