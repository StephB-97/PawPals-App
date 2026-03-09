/**
 * layout.tsx - The root layout that wraps every page in our app.
 * 
 * ClerkProvider gives every component access to authentication —
 * who's logged in, sign-in/sign-out functions, user data, etc.
 * 
 * Geist is the font Next.js uses by default. We keep it because
 * it's clean and modern — good for a minimal UI.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PawPals - Find Your Pet's Next Best Friend",
  description: "A pet social discovery platform for dogs and cats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
