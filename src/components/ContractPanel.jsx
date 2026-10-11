import { useState } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { Database, Upload, Download } from "lucide-react";

export default function ContractPanel() {
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ CONTRACT ADDRESS KAMU
  const contractAddress = "0xB7a072b3eF226D2219b74cb3fEb8eCff322243bC";

  // ✅ ABI KAMU
  const abi = [
    "function set(uint _data)",
    "function get() view returns (uint256)"
  ];

  // 🔗 GET CONTRACT INSTANCE
  const getContract = async () => {
    if (!window.ethereum) return alert("MetaMask tidak ditemukan!");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return new ethers.Contract(contractAddress, abi, signer);
  };

  // 📤 SET DATA (WRITE BLOCKCHAIN)
  const handleSet = async () => {
    try {
      setLoading(true);
      const contract = await getContract();

      const tx = await contract.set(input);
      await tx.wait();

      alert("✅ Data berhasil disimpan ke blockchain!");
      setInput("");

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 📥 GET DATA (READ BLOCKCHAIN)
  const handleGet = async () => {
    try {
      setLoading(true);
      const contract = await getContract();

      const result = await contract.get();
      setData(result.toString());

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-96 mt-6 p-6 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl flex flex-col gap-4"
    >
      {/* TITLE */}
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Database size={20} />
        Smart Contract Panel
      </h2>

      {/* INPUT */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Masukkan angka..."
        className="p-2 rounded text-black"
      />

      {/* BUTTON SET */}
      <button
        onClick={handleSet}
        disabled={loading}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 p-2 rounded"
      >
        <Upload size={18} />
        Save to Blockchain
      </button>

      {/* BUTTON GET */}
      <button
        onClick={handleGet}
        disabled={loading}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 p-2 rounded"
      >
        <Download size={18} />
        Get Data
      </button>

      {/* OUTPUT */}
      {data !== null && (
        <div className="text-yellow-400 text-center mt-2">
          Data from blockchain: <b>{data}</b>
        </div>
      )}
    </motion.div>
  );
}