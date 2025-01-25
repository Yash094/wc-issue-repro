"use client";
import { client } from "./client";
import { baseSepolia } from "thirdweb/chains";
import {
  ConnectButton,
} from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { useState } from "react";
import { useLinkProfile } from "thirdweb/react";

const WALLET_OPTIONS = [
  { id: "io.metamask", label: "MetaMask" },
  { id: "com.trustwallet.app", label: "Trust Wallet" },
  { id: "com.binance", label: "Binance Wallet" },
  { id: "com.safepal", label: "SafePal Wallet" },
  { id: "me.rainbow", label: "Rainbow Wallet" },
  { id: "com.ledger", label: "Ledger Live" },
] as const;

type WalletType = (typeof WALLET_OPTIONS)[number]["id"];

export default function Home() {
  const [selectedWallet, setSelectedWallet] = useState<WalletType>("walletConnect");
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
        wallet: createWallet(selectedWallet),
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
        
        <select
          value={selectedWallet}
          onChange={(e) => setSelectedWallet(e.target.value as WalletType)}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {WALLET_OPTIONS.map((wallet) => (
            <option key={wallet.id} value={wallet.id}>
              {wallet.label}
            </option>
          ))}
        </select>

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