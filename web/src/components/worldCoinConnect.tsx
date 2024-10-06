"use client";

import React, { useEffect, useState } from "react";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WorldCoinConnect() {
  const [worldcoinVerified, setWorldcoinVerified] = useState(false);
  const [worldcoinId, setWorldcoinId] = useState<any>(null);

  useEffect(() => {
    const signature = localStorage.getItem("worldcoinSignature");
    if (signature) {
      setWorldcoinVerified(true);
      const worldcoinSignature = JSON.parse(signature);
      setWorldcoinId({
        nullifier_hash: worldcoinSignature.message,
      });
      console.log("Loaded worldcoin");
      localStorage.setItem(
        "worldcoinSignature",
        JSON.stringify(worldcoinSignature)
      );
    }
  }, [worldcoinVerified]);

  const handleVerify = async (proof: any) => {
    const response = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proof }),
    });
    if (!response.ok) {
      throw new Error(`Error verifying Worldcoin: ${response.statusText}`);
    }

    const data = await response.json();
    setWorldcoinVerified(data.verified);
  };

  const handleSign = async (message: string) => {
    console.log("Connected to Worldcoin");
  };

  const onSuccess = async (proof: any) => {
    // Sign the verified nullifier hash and store in the localStorage
    await handleSign(proof.nullifier_hash);
    setWorldcoinId(proof);
  };

  return (
    <>
      {!worldcoinId ? (
        <IDKitWidget
          app_id="app_staging_3b4da3c7378c9567e05e04f8f7a8917c" // obtained from the Developer Portal
          action="verify-human" // this is your action id from the Developer Portal
          onSuccess={onSuccess} // callback when the modal is closed
          handleVerify={handleVerify} // optional callback when the proof is received
          verification_level={VerificationLevel.Device}
        >
          {({ open }) => (
            <button
              className="flex items-center font-bold text-lg px-4 py-2 bg-black text-white rounded-md cursor-pointer"
              onClick={open}
            >
              <img src="https://i.ibb.co/P4mg2Z9/image.png" alt="" className="rounded-full h-8 w-8 mr-2" />
              Get Started
            </button>
          )}
        </IDKitWidget>
      ) : (
        <div className="text-right mt-1 mr-1">
          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
            <ConnectButton label="Connect Wallet" />
          </span>
        </div>
      )}
    </>
  );
}
