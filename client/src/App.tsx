import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
import { JsonRpcProvider, Contract, Signer } from "ethers";
import CounterABI from "./Counter.json";
import "./App.css";

const provider = new JsonRpcProvider("http://127.0.0.1:8545");
const contractAddress = "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1"; // Substitua pelo endereço do contrato

const contract = new Contract(contractAddress, CounterABI.abi, provider) as any;
console.log("Código do contrato:", contractAddress); // deve ser diferente de "0x"

const App: React.FC = () => {
const [count, setCount] = useState(0);

const [account, setAccount] = useState("");
const [signer, setSigner] = useState<Signer | null>(null);

const [name, setName] = useState("");

const [message, setMessage] = useState("");

const [theme, setTheme] = useState<"light" | "dark">("light");

function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

  useEffect(() => {
  async function load() {
    try {
      // Obter o signer principal
      const signer = await provider.getSigner();
      setSigner(signer);
      
      // Obter o endereço da conta (string) do signer
      const address = await signer.getAddress();
      setAccount(address);

      const contractWithSigner = contract.connect(signer);
      const currentCount = await contractWithSigner.getCount();
      setCount(Number(currentCount));

      const contractName = await contract.getName();
      console.log("Nome lido do contrato:", contractName); 
      setName(contractName);


    } catch (error) {
      console.error("Error loading data:", error);
      setAccount("");
    }
  }
  load();
  }, []);

  useEffect(() => {
    if (isPrime(count)) {
      setMessage(`🎉 Parabéns! ${count} é um número primo!`);
      const timeout = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timeout);
    } else {
      setMessage("");
    }
  }, [count]);


  const increment = async () => {
    if (!signer) return;
    const contractWithSigner = contract.connect(signer);
    const tx = await contractWithSigner.increment();
    await tx.wait();
    const newCount = await contractWithSigner.getCount();
    setCount(Number(newCount));
  };

  const decrement = async () => {
    if (!signer) return;
    const contractWithSigner = contract.connect(signer);
    const tx = await contractWithSigner.decrement();
    await tx.wait();
    const newCount = await contractWithSigner.getCount();
    setCount(Number(newCount));
  };

  const reset = async () => {
        if (!signer) return;
        const contractWithSigner = contract.connect(signer);
        const tx = await contractWithSigner.reset();
        await tx.wait();
        const newCount = await contractWithSigner.getCount();
        setCount(Number(newCount));
    };

  return (
    <div className={`container ${theme}`}>
      <h1>Contador Descentralizado</h1>
      <p><strong>Nome no contrato:</strong> {name}</p>
      <p>Conta: {account}</p>
      <p>Contador: {count}</p>

      {message && <p className="parabens">{message}</p>}

      <button onClick={increment}>Incrementar</button>
      <button onClick={decrement}>Decrementar</button>
      <button onClick={reset}>Resetar</button>
    </div>
  );
};

export default App;