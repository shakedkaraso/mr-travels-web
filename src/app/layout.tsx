import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import VisualEditorBoot from "@/components/dev/VisualEditorBoot";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "hebrew"],
});

export const metadata: Metadata = {
  title: "Mr.travels",
  description: "מר טראבלס — הטיסות והחבילות הכי משתלמות בשבילכם.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        {/* DealsPopup temporarily disabled at the user's request — component kept for later */}
        {process.env.NODE_ENV === "development" && <VisualEditorBoot />}
      </body>
    </html>
  );
}
