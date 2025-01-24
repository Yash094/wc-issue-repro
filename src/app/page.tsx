"use client";
import { client } from "./client";
import { baseSepolia } from "thirdweb/chains";
import {
  ConnectButton,
} from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { useState } from "react";
import { useLinkProfile } from "thirdweb/react";

export default function Home() {
  const [isLinking, setIsLinking] = useState(false);
  const {
    mutate: linkProfile,
    isPending: isLinkingMain,
    error: linkError,
  } = useLinkProfile();
  console.log(isLinkingMain)

  const handleLinkProfile = async () => {
    try {
      setIsLinking(true);
      linkProfile({
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
      
      <div className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
        Status: {isLinkingMain ? 'true' : 'false'}
      </div>

      {isLinkingMain && (
        <div className="text-sm text-blue-600 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          Linking your wallet...
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        <ConnectButton
          client={client}
          chain={baseSepolia}
        />
        
        <button
          onClick={handleLinkProfile}
          disabled={isLinking || isLinkingMain}
          className={`
            px-6 py-2 rounded-lg
            ${(isLinking || isLinkingMain)
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700'
            }
            text-white transition-all duration-200
            flex items-center gap-2
          `}
        >
          {(isLinking || isLinkingMain) ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Linking...
            </>
          ) : (
            'Link Profile'
          )}
        </button>

        {linkError && (
          <p className="text-red-500 text-sm">
            Error: {linkError.message}
          </p>
        )}
      </div>
    </main>
  );
}
