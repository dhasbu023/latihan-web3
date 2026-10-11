import { useState } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { Wallet, CheckCircle, Sparkles, Coins, Loader2 } from "lucide-react";

export default function WalletButton() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask belum terinstall!");
      return;
    }

    try {
      setLoading(true);

      // 1. Connect wallet
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const userAddress = accounts[0];
      setAccount(userAddress);

      // 2. Provider
      const provider = new ethers.BrowserProvider(window.ethereum);

      // 3. Get balance
      const balanceWei = await provider.getBalance(userAddress);
      const balanceEth = ethers.formatEther(balanceWei);

      setBalance(parseFloat(balanceEth).toFixed(4));

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-80 flex flex-col items-center gap-6 p-6 rounded-2xl 
                 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
                 shadow-2xl border border-gray-700"
    >
      {/* HEADER ICON */}
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="text-blue-400"
      >
        <Sparkles size={34} />
      </motion.div>

      {/* TITLE */}
      <h2 className="text-xl font-bold text-white">
        Web3 Wallet Dashboard
      </h2>

      {/* CONNECT BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={connectWallet}
        disabled={loading}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
                   disabled:opacity-50 text-white px-6 py-2 rounded-xl transition"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <Wallet size={18} />
        )}
        {loading ? "Connecting..." : "Connect Wallet"}
      </motion.button>

      {/* ACCOUNT */}
      {account && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-green-400 
                     bg-green-900/20 px-4 py-2 rounded-xl"
        >
          <CheckCircle size={18} />
          <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
        </motion.div>
      )}

      {/* BALANCE */}
      {balance && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-yellow-300 
                     bg-yellow-900/20 px-4 py-2 rounded-xl"
        >
          <Coins size={18} />
          <span>{balance} ETH</span>
        </motion.div>
      )}

      {/* FOOTER INFO */}
      <p className="text-xs text-gray-400 text-center">
        Click connect wallet → approve MetaMask → data will appear
      </p>
    </motion.div>
  );
}