export type Direction = 'UP' | 'DOWN' | 'IDLE';

export interface RequestItem {
    id: string;
    timestamp: number;
    origin: number;
    destination?: number;
    type: 'EXTERNAL' | 'INTERNAL';
    escalated?: boolean;
    assignedAt?: number;
    pickedAt?: number;
    droppedAt?: number;
}

export interface Elevator {
    id: string;
    currentFloor: number;
    direction: Direction;
    doorOpen: boolean;
    passengers: RequestItem[];
    capacity: number;
    targetQueue: number[];
    stateSince: number;
}

export interface SimulationState {
    elevators: Elevator[];
    pendingExternal: RequestItem[];
    metrics: {
        served: number;
        avgWaitMs?: number;
        avgTravelMs?: number;
    };
}
