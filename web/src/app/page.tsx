"use client";
import { useAccount } from "wagmi";

export default function Home() {
  const { address } = useAccount();
  return <div>Hi this is the intial app</div>;
}
