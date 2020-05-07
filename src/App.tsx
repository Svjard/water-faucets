import React, { useState, useCallback, FormEvent } from 'react';
import useSetInterval from './hooks/useSetInterval';

import NumberInput from './components/NumberInput';
import SimModal from './components/SimModal';

import './App.css';
import { toggleFaucets } from './utils/faucet-toggle';

function createNewArray(size: number) {
  return new Array(size).fill(0);
}

function App() {
  const [total, setTotal] = useState<number>(10);
  const [faucets, setFaucets] = useState<Array<number>>(createNewArray(total));
  const [showSimDlg, setShowSimDlg] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simStates, setSimStates] = useState<Array<Array<number>>>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const updateTotalFaucets = useCallback((newTotal: number) => {
    setTotal(newTotal);
    setFaucets(createNewArray(newTotal));
  }, []);

  const toggleFaucet = useCallback((index: number) => {
    const newFaucets = Array.from(faucets);
    newFaucets[index] ^= 1;
    setFaucets(newFaucets);
  }, [faucets]);

  const onSimCallback = useCallback(async (sim?: string|null, mode?: string) => {
    if (sim) {
      if (mode === 'final') {
        setFaucets(toggleFaucets(faucets, sim));
      } else {
        const lines = sim.split(/\r?\n+/);
        const states = [];
        for (let i = 0; i < lines.length; i++) {
          const state = toggleFaucets(i === 0 ? faucets : states[i-1], lines[i]);
          states.push(state);
        }
        setSimStates(states);
        setCurrentIndex(0);
        setIsRunning(true);
      }
    }
    setShowSimDlg(false);
  }, [faucets]);

  const onShowSimDlg = useCallback(() => {
    setShowSimDlg(true);
  }, []);

  useSetInterval(() => {
    if (currentIndex === simStates.length-1) {
      setIsRunning(false);
    } else {
      setFaucets(simStates[currentIndex+1]);
      setCurrentIndex(currentIndex+1);
    }
  }, isRunning ? 1000 : null);

  return (
    <div className="App">
      <NumberInput
        defaultValue={total}
        onChange={(ev: FormEvent<HTMLInputElement>) => updateTotalFaucets(+ev.currentTarget.value)}
        name="totalFaucets"
        title="Total Faucets"
      />
      <button className="Btn" onClick={() => updateTotalFaucets(faucets.length)}>Reset Faucets</button>
      <button className="Btn" onClick={onShowSimDlg}>Create Simulation</button>
      {showSimDlg && <SimModal isOpen={showSimDlg} total={total} onClose={onSimCallback} />}

      <div className="Header">
        <h3>On: {faucets.filter((faucet: number) => faucet).length}</h3>
        <h3>Off: {faucets.filter((faucet: number) => !faucet).length}</h3>
      </div>

      <div className="Container">
        <div className="GridRow">
          {faucets.map((faucet: number, index: number) => (
            <div
              className={`Faucet ${faucet ? 'Faucet-On' : 'Faucet-Off'}`}
              onClick={() => toggleFaucet(index)}>
              {index}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
