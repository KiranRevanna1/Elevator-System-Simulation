import React, { useState } from 'react';
import axios from 'axios';

interface ControlsProps {
  floors: number;
}

export const Controls: React.FC<ControlsProps> = ({ floors }) => {
  const [origin, setOrigin] = useState(1);
  const [destination, setDestination] = useState(1);

  const startSim = async () => { await axios.post('http://localhost:4000/control/start'); };
  const stopSim = async () => { await axios.post('http://localhost:4000/control/stop'); };
  const resetSim = async () => { await axios.post('http://localhost:4000/control/reset'); };

  const addRequest = async () => {
    if (origin === destination) return;
    await axios.post('http://localhost:4000/request', { origin, destination });
  };

  return (
    <div className="controls">
      <button onClick={startSim}>Start</button>
      <button onClick={stopSim}>Stop</button>
      <button onClick={resetSim}>Reset</button>
      <div style={{ marginTop: '10px' }}>
        <label>Origin: </label>
        <input type="number" min={1} max={floors} value={origin} onChange={e => setOrigin(Number(e.target.value))} />
        <label> Destination: </label>
        <input type="number" min={1} max={floors} value={destination} onChange={e => setDestination(Number(e.target.value))} />
        <button onClick={addRequest}>Add Request</button>
      </div>
    </div>
  );
};
