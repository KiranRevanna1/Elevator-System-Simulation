import { v4 as uuidv4 } from 'uuid';
import { Elevator, RequestItem, SimulationState } from './types';

export class Simulation {
    elevators: Elevator[] = [];
    pendingExternal: RequestItem[] = [];
    metrics = { served: 0, totalWait: 0, totalTravel: 0 };
    tickHandle: NodeJS.Timeout | null = null;
    tickInterval = 500;

    constructor(public floors: number = 10, elevatorCount: number = 3) {
        for (let i = 0; i < elevatorCount; i++) {
            this.elevators.push(this.createElevator(i + 1));
        }
    }

    createElevator(i: number): Elevator {
        return {
            id: `E${i}`,
            currentFloor: 1,
            direction: 'IDLE',
            doorOpen: false,
            capacity: 8,
            passengers: [],
            targetQueue: [],
            stateSince: Date.now(),
        };
    }

    start() {
        if (this.tickHandle) return;
        this.tickHandle = setInterval(() => this.tick(), this.tickInterval);
    }

    stop() {
        if (!this.tickHandle) return;
        clearInterval(this.tickHandle);
        this.tickHandle = null;
    }

    reset() {
        this.stop();
        this.pendingExternal = [];
        this.metrics = { served: 0, totalWait: 0, totalTravel: 0 };
        this.elevators.forEach((e) => {
            e.currentFloor = 1;
            e.direction = 'IDLE';
            e.doorOpen = false;
            e.passengers = [];
            e.targetQueue = [];
        });
    }

    addExternalRequest(origin: number, destination?: number) {
        const req: RequestItem = {
            id: uuidv4(),
            timestamp: Date.now(),
            origin,
            destination,
            type: 'EXTERNAL',
            escalated: false,
        };
        this.pendingExternal.push(req);
        return req;
    }

    estimateTimeToPickup(e: Elevator, origin: number): number {
        let time = 0;
        let floor = e.currentFloor;
        const targets = [...e.targetQueue];

        if (targets.length === 0 && e.direction === 'IDLE') {
            return Math.abs(origin - floor) * 1000 + 800;
        }

        for (const t of targets) {
            time += Math.abs(t - floor) * 1000 + 800;
            floor = t;
            if (floor === origin) return time;
        }

        time += Math.abs(origin - floor) * 1000;
        return time;
    }

    assignRequests() {
        const now = Date.now();
 
        for (const r of this.pendingExternal) {
            if (!r.escalated && now - r.timestamp > 30000) r.escalated = true;
        }
       
        this.pendingExternal.sort((a, b) =>
            a.escalated === b.escalated ? a.timestamp - b.timestamp : (a.escalated ? -1 : 1)
        );

        const remaining: RequestItem[] = [];
        for (const req of this.pendingExternal) {
            let best: Elevator | null = null;
            let bestETP = Infinity;

            for (const e of this.elevators) {
                if (e.targetQueue.length >= e.capacity) continue;
                const etp = this.estimateTimeToPickup(e, req.origin);
                if (etp < bestETP) { bestETP = etp; best = e; }
            }

            if (best) {
                if (!best.targetQueue.includes(req.origin)) best.targetQueue.push(req.origin);
                if (req.destination && !best.targetQueue.includes(req.destination)) best.targetQueue.push(req.destination);
                req.assignedAt = Date.now();
            } else {
                remaining.push(req);
            }
        }
        this.pendingExternal = remaining;
    }

    stepElevator(e: Elevator) {
        if (e.targetQueue.length === 0) {
            e.direction = 'IDLE';
            e.doorOpen = false;
            return;
        }

        const next = e.targetQueue[0];

        if (next === e.currentFloor) {
            if (!e.doorOpen) {
                e.doorOpen = true;
                e.stateSince = Date.now();

                for (const req of this.pendingExternal) {
                    if (req.origin === e.currentFloor) {
                        req.pickedAt = Date.now();
                        e.passengers.push(req);
                    }
                }
            } else if (Date.now() - e.stateSince > 1000) {
                e.doorOpen = false;

                e.passengers.forEach(p => {
                    if (p.destination === e.currentFloor) p.droppedAt = Date.now();
                });
                e.passengers = e.passengers.filter(p => p.destination !== e.currentFloor);

                e.targetQueue.shift();
                this.metrics.served += 1;

                if (e.targetQueue.length === 0) e.direction = 'IDLE';
            }
        } else {
            e.doorOpen = false;
            if (next > e.currentFloor) e.currentFloor += 1, e.direction = 'UP';
            else e.currentFloor -= 1, e.direction = 'DOWN';
        }
    }

    tick() {
        this.assignRequests();
        for (const e of this.elevators) this.stepElevator(e);
    }

    getState(): SimulationState {
        let totalWait = 0, totalTravel = 0, servedCount = 0;

        for (const e of this.elevators) {
            for (const p of e.passengers) {
                if (p.pickedAt && p.timestamp) totalWait += p.pickedAt - p.timestamp;
                if (p.droppedAt && p.pickedAt) totalTravel += p.droppedAt - p.pickedAt;
                if (p.droppedAt) servedCount += 1;
            }
        }

        const served = this.metrics.served;
        const avgWaitMs = servedCount > 0 ? totalWait / servedCount : 0;
        const avgTravelMs = servedCount > 0 ? totalTravel / servedCount : 0;

        return {
            elevators: this.elevators,
            pendingExternal: this.pendingExternal,
            metrics: { served, avgWaitMs, avgTravelMs },
        };
    }
}
