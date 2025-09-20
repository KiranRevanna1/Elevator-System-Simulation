import React from 'react';

interface ElevatorProps {
  id: string;
  currentFloor: number;
  direction: 'UP' | 'DOWN' | 'IDLE';
  doorOpen: boolean;
  passengers: number;
}

export const Elevator: React.FC<ElevatorProps> = ({ id, currentFloor, direction, doorOpen, passengers }) => {
  let bgColor = '#2196F3';
  if (doorOpen) bgColor = '#FFA500';
  else if (direction === 'UP') bgColor = '#4CAF50';
  else if (direction === 'DOWN') bgColor = '#f44336';

  return (
    <div
      className="elevator"
      style={{
        bottom: `${(currentFloor - 1) * 50}px`,
        backgroundColor: bgColor,
      }}
    >
      <div>{id}</div>
      <div>{direction === 'UP' ? '↑ UP' : direction === 'DOWN' ? '↓ DOWN' : 'IDLE'}</div>
      <div>{doorOpen ? '🚪 Open' : '🚪 Closed'}</div>
      <div>Passengers: {passengers}</div>
    </div>
  );
};
