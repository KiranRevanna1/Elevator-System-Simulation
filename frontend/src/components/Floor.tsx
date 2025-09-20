import React from 'react';

interface FloorProps {
  floorNumber: number;
}

export const Floor: React.FC<FloorProps> = ({ floorNumber }) => {
  return (
    <div className="floor">
      Floor {floorNumber}
    </div>
  );
};
