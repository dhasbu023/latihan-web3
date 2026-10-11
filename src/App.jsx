import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Coins,
  Swords,
  RefreshCcw,
  Sparkles,
  Zap,
  Crown,
} from "lucide-react";

import ABI from "./contracts/MonsterGameABI.json";
import { CONTRACT_ADDRESS } from "./contracts/config";

export default function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  const [monsters, setMonsters] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    attack: 50,
    defense: 30,
    rarity: "Epic",
  });

  // CONNECT WALLET
  const connect = async () => {
    if (!window.ethereum) return alert("Install MetaMask");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const addr = await signer.getAddress();
    setAccount(addr);

    const bal = await provider.getBalance(addr);
    setBalance(ethers.formatEther(bal));

    const c = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    setContract(c);
  };

  // LOAD MONSTERS
  const loadMonsters = async () => {
    if (!contract || !account) return;

    setLoading(true);

    try {
      const total = await contract.nextTokenId();

      const data = [];

      for (let i = 0; i < total; i++) {
        try {
          const owner = await contract.ownerOf(i);

          if (owner.toLowerCase() === account.toLowerCase()) {
            const m = await contract.getMonster(i);

            data.push({
              id: i,
              name: m.name,
              level: m.level.toString(),
              attack: m.attack.toString(),
              defense: m.defense.toString(),
              rarity: m.rarity,
            });
          }
        } catch {}
      }

      setMonsters(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // MINT
  const mintMonster = async () => {
    if (!contract) return;

    const tx = await contract.mintMonster(
      account,
      form.name,
      form.attack,
      form.defense,
      form.rarity
    );

    await tx.wait();
    loadMonsters();
  };

  // LEVEL UP (REAL CONTRACT FUNCTION)
  const levelUp = async (id) => {
    const tx = await contract.levelUp(id);
    await tx.wait();
    loadMonsters();
  };

  useEffect(() => {
    if (contract && account) loadMonsters();
  }, [contract, account]);

  const emoji = (name) => {
    if (name?.toLowerCase().includes("dragon")) return "🐉";
    if (name?.toLowerCase().includes("wolf")) return "🐺";
    return "👾";
  };

  const rarityColor = (r) => {
    if (r?.toLowerCase() === "legendary")
      return "text-yellow-400 border-yellow-500/30";
    if (r?.toLowerCase() === "epic")
      return "text-cyan-400 border-cyan-500/30";
    return "text-gray-300 border-white/10";
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">

        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-black flex items-center gap-2"
        >
          <Sparkles className="text-purple-400" />
          MonsterVerse
        </motion.h1>

        <div className="flex gap-3 items-center">

          {balance && (
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
              <Coins size={16} />
              {parseFloat(balance).toFixed(4)} ETH
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={connect}
            className="bg-purple-600 px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Wallet size={16} />
            {account ? account.slice(0, 6) + "..." : "Connect"}
          </motion.button>

        </div>
      </div>

      {/* MINT PANEL */}
      <div className="bg-white/5 p-4 rounded-xl mb-6 border border-white/10">

        <h2 className="font-bold mb-3 flex items-center gap-2">
          <Zap size={16} /> Mint Monster
        </h2>

        <div className="flex gap-2">

          <input
            placeholder="Name"
            className="p-2 bg-black/30 rounded"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={mintMonster}
            className="bg-green-600 px-4 py-2 rounded flex items-center gap-2"
          >
            <Crown size={16} />
            Mint
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={loadMonsters}
            className="bg-white/10 px-4 py-2 rounded flex items-center gap-2"
          >
            <RefreshCcw size={16} />
          </motion.button>

        </div>

      </div>

      {/* MONSTERS */}
      <h2 className="mb-4 text-gray-300">Your Monsters</h2>

      {loading && <p className="text-gray-400">Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <AnimatePresence>
          {monsters.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/5 p-4 rounded-xl border border-white/10 hover:scale-105 transition"
            >

              <div className="text-5xl">{emoji(m.name)}</div>

              <h3 className="font-bold text-lg mt-2">{m.name}</h3>

              <div
                className={`inline-block mt-1 px-2 py-1 rounded border text-xs ${rarityColor(
                  m.rarity
                )}`}
              >
                {m.rarity}
              </div>

              <p className="mt-2">⭐ Level: {m.level}</p>
              <p>⚔️ Attack: {m.attack}</p>
              <p>🛡️ Defense: {m.defense}</p>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => levelUp(m.id)}
                className="mt-3 w-full bg-cyan-600 px-3 py-2 rounded flex items-center justify-center gap-2"
              >
                <Swords size={16} />
                Level Up
              </motion.button>

            </motion.div>
          ))}
        </AnimatePresence>

      </div>

    </div>
  );
}