import React, { useState } from 'react';
import axios from 'axios';

interface ControlsProps {
  floors: number;
}

const API_URL =
  import.meta.env?.VITE_SERVER_URL || process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const Controls: React.FC<ControlsProps> = ({ floors }) => {
  const [origin, setOrigin] = useState(1);
  const [destination, setDestination] = useState(1);

  const startSim = async () => { await axios.post(`${API_URL}/control/start`); };
  const stopSim = async () => { await axios.post(`${API_URL}/control/stop`); };
  const resetSim = async () => { await axios.post(`${API_URL}/control/reset`); };

  const addRequest = async () => {
    if (origin === destination) return;
    await axios.post(`${API_URL}/request`, { origin, destination });
  };

  return (
    <div className="controls">
      <button onClick={startSim}>Start</button>
      <button onClick={stopSim}>Stop</button>
      <button onClick={resetSim}>Reset</button>
      <div style={{ marginTop: '10px' }}>
        <label>Origin: </label>
        <input
          type="number"
          min={1}
          max={floors}
          value={origin}
          onChange={e => setOrigin(Number(e.target.value))}
        />
        <label> Destination: </label>
        <input
          type="number"
          min={1}
          max={floors}
          value={destination}
          onChange={e => setDestination(Number(e.target.value))}
        />
        <button onClick={addRequest}>Add Request</button>
      </div>
    </div>
  );
};
