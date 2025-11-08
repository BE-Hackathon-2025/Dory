import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const openDyslexic = localFont({
  src: [
    { path: "../public/fonts/OpenDyslexic-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/OpenDyslexic-Bold.woff2",    weight: "700", style: "normal" },
  ],
  variable: "--font-open-dyslexic",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dory | Personalized Learning Assistant",
  description: "AI-powered reading companion for students with learning differences",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          openDyslexic.variable, // <-- makes CSS var(--font-open-dyslexic) available
          "antialiased bg-gray-50 text-gray-900",
        ].join(" ")}
      >
        <header className="bg-white border-b shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 justify-start">
            <span className="text-2xl leading-none">🐟</span>
            <h1 className="font-semibold text-xl text-gray-900 tracking-tight">
              Dory
            </h1>
          </div>
        </header>

        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
