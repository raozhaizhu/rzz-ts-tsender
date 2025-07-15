import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import "@rainbow-me/rainbowkit/styles.css";
import { type ReactNode } from "react";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "RzzTSender",
    description: "该页面由Raozhaizhu制作,用于展示WEB3/NextJs相关技术栈",
    openGraph: {
        title: "RzzTSender",
        description: "该页面由Raozhaizhu制作,用于展示WEB3/NextJs相关技术栈",
        url: "https://vercel.com/raozhaizhus-projects/rzz-ts-tsender",
        images: [{ url: "/cover.png" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "RzzTSender",
        description: "该页面由Raozhaizhu制作,用于展示WEB3/NextJs相关技术栈",
        images: ["/cover.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Providers>
                    <Header />
                    <main className="container mx-auto my-4 px-2 md:px-0">{children}</main>
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
