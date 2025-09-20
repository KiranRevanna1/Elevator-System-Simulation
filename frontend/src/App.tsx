import React, { useEffect, useState } from 'react';
import { socket } from './services/socket';
import { Elevator } from './components/Elevator';
import { Controls } from './components/Controls';
import './styles.css';
import './index.css';

interface RequestItem {
  id: string;
  timestamp: number;
  origin: number;
  destination?: number;
}

interface ElevatorState {
  id: string;
  currentFloor: number;
  direction: 'UP' | 'DOWN' | 'IDLE';
  doorOpen: boolean;
  passengers: RequestItem[];
}

interface SimState {
  elevators: ElevatorState[];
  pendingExternal: RequestItem[];
  metrics: { served: number };
}

function App() {
  const [state, setState] = useState<SimState>({
    elevators: [],
    pendingExternal: [],
    metrics: { served: 0 },
  });

  const floors = 10;
  const shafts = 3;

  useEffect(() => {
    socket.on('state', (data: SimState) => setState(data));
    return () => { socket.off('state'); };
  }, []);

  return (
    <div className="app">
      <h1>Elevator Simulation</h1>
      <Controls floors={floors} />
      <div>Pending Requests: {state.pendingExternal.length}</div>
      <div>Requests Served: {state.metrics.served}</div>

      <div className="simulation">
        {Array.from({ length: shafts }).map((_, shaftIndex) => (
          <div key={shaftIndex} className="shaft">
            {Array.from({ length: floors })
              .map((_, i) => floors - i)
              .map(floorNum => (
                <div key={floorNum} className="floor">{floorNum}</div>
              ))}

            {state.elevators
              .filter(e => Number(e.id.replace('E', '')) === shaftIndex + 1)
              .map(e => (
                <Elevator
                  key={e.id}
                  id={e.id}
                  currentFloor={e.currentFloor}
                  direction={e.direction}
                  doorOpen={e.doorOpen}
                  passengers={e.passengers.length}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
