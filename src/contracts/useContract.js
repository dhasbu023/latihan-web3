import { ethers } from "ethers";
import abi from "./MonsterGameABI.json";
import { CONTRACT_ADDRESS } from "./config";

export const getProvider = () => {
  return new ethers.BrowserProvider(window.ethereum);
};

export const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner();
};

export const getContract = async () => {
  const signer = await getSigner();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    abi,
    signer
  );
};