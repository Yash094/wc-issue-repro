"use client";
import { client } from "./client";
import { baseSepolia } from "thirdweb/chains";
import {
  ConnectButton,
} from "thirdweb/react";
import { createWallet, linkProfile } from "thirdweb/wallets";
import { useState } from "react";

export default function Home() {
  const [isLinking, setIsLinking] = useState(false);

  const handleLinkProfile = async () => {
    try {
      setIsLinking(true);
      await linkProfile({
        client,
        strategy: "wallet",
        wallet: createWallet("walletConnect"),
        chain: baseSepolia,
      });
    } catch (error) {
      console.error("Failed to link profile:", error);
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <main className="min-h-screen p-8 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold mb-4">Wallet Connection</h1>

      <div className="flex flex-col items-center gap-4">
        <ConnectButton
          client={client}
          chain={baseSepolia}
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
        />
        
        <button
          onClick={handleLinkProfile}
          disabled={isLinking}
          className={`
            px-6 py-2 rounded-lg
            ${isLinking 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700'
            }
            text-white transition-all duration-200
            flex items-center gap-2
          `}
        >
          {isLinking ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Linking...
            </>
          ) : (
            'Link Profile'
          )}
        </button>
      </div>
    </main>
  );
}

