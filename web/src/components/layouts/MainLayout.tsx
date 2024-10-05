"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen justify-start items-center flex flex-col bg-[#FDF7F2] text-black">
      <header className="container mx-auto py-6 sticky top-0 bg-[#FDF7F2] z-10">
        <Link href="/" className="z-10 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-[#FF6B4A]"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            <h1 className="text-2xl font-bold">resolve</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ConnectButton label="Get started" />
            <ModeToggle />
          </div>
        </Link>
      </header>

      <section className="lg:w-full my-5 container">
        <div className="ring-1 ring-zinc-700 rounded-xl p-8 w-full">
          <div className="flex justify-center items-start flex-col">
            <div className="flex justify-center items-between flex-col w-full">
              {children}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
