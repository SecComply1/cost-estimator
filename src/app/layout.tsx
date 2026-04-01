import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "SecComply Cost Estimator | Compliance Cost Calculator",
  description:
    "Get an instant, detailed estimate for ISO 27001, SOC 2, GDPR, HIPAA, PCI DSS, RBI, SEBI, DPDPA compliance costs. Powered by SecComply.",
  keywords: [
    "compliance cost estimator",
    "ISO 27001 cost",
    "SOC 2 cost India",
    "GDPR compliance cost",
    "HIPAA compliance",
    "PCI DSS cost",
    "SecComply",
    "compliance calculator",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body
        className="font-inter antialiased text-[#F1F5F9]"
        style={{ backgroundColor: "#0A0E17" }}
      >
        {/* Background grid pattern */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(30,41,59,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
