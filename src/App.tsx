import React, {useEffect, useState} from "react";
import './App.css';
import {useWeb3React} from "@web3-react/core";
import {injected} from "./index";
import {Web3Provider} from "@ethersproject/providers";
import {BigNumber, CallOverrides, Contract, ContractTransaction} from "ethers";

export const App: React.FC = () => {
  const { account, library, connector, activate, deactivate } = useWeb3React()
  const [ counter, setCounter ] = useState<string>('undefined')
  const [ update, setUpdate ] = useState<number>(0)

    const connectWallet = () => {
      activate(injected)
    }

    const disconnectWallet = () => {
      deactivate()
    }

    useEffect(() => {
      if (account) {
         getContract(library).then( async (contract) => {
           setCounter((await contract.counter()).toString())
         })
      }
    }, [account, update])

  const increment = () => {
    getContract(library).then( async (contract) => {
      const tx = await contract.increment()
      await tx.wait()
      setUpdate(update + 1)
    })
  }

  return (
    <div className="App">
      <header className="App-header">
          Account {account}
        <div>Counter {counter}</div>

        <button onClick={increment}>Increment</button>

        <a className="App-link" onClick={connectWallet}>
          Connect Wallet
        </a>
          <a className="App-link" onClick={disconnectWallet}>
          Disconnect Wallet
        </a>
      </header>
    </div>
  );
}

export default App;

let _contract: CounterContract

export async function getContract(library: Web3Provider): Promise<CounterContract> {
  if (!_contract) {
    const contract = new Contract(
        '0x9493BaC184d46ebAa977E2b8c8c399355591B69C',
        [{"inputs":[],"name":"counter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"increment","outputs":[],"stateMutability":"nonpayable","type":"function"}],
        library.getSigner()
    )
    await contract.deployed()
    _contract = contract as unknown as CounterContract
  }
  return _contract
}

export interface CounterContract {
  counter(overrides?: CallOverrides): Promise<BigNumber>;
  increment(overrides?: CallOverrides): Promise<ContractTransaction>
}