# Elevator System Simulation

A web-based elevator simulation system with an intelligent scheduling algorithm that efficiently handles passenger requests while prioritizing user experience.

---

## **Features**

- Real-time simulation of multiple elevators serving multiple floors.
- Displays:
  - Elevator positions
  - Directions (↑ / ↓ / IDLE)
  - Door states (Open/Closed)
  - Passenger count
- Visualizes:
  - Pending floor requests
  - Destination requests inside elevators
- Interactive controls:
  - Adjust number of elevators and floors
  - Start / Stop / Reset simulation
  - Speed controls (1x, 2x, 5x)
- Color-coded elevator states:
  - Green → moving up
  - Red → moving down
  - Blue → idle
  - Orange → door open
- Intelligent scheduling:
  - Minimizes average wait time
  - Prevents request starvation
  - Escalates requests waiting >30 seconds
  - Handles peak traffic scenarios

---

## **Setup Instructions**

### **Prerequisites**

- Node.js (v16+ recommended)
- npm or yarn

### **Backend**

1. Navigate to backend folder:
   ```bash
   cd backend

2. Install dependencies:
  ``` bash
    npm install

3. Start server:
  ``` bash
  npm run server


4. The backend runs on http://localhost:4000.

### **Frontend**

1. Navigate to frontend folder:
  ``` bash
    cd frontend


2. Install dependencies:
  ``` bash
    npm install


3. Start React app:
  ``` bash
    npm start


4. Open http://localhost:3000 in your browser.

----

## Usage

- Use the Controls panel to:

  - Start, Stop, Reset simulation

  - Adjust speed (1x, 2x, 5x)

- Click floor buttons inside elevators to simulate passenger requests.

- External floor requests can be generated automatically or manually.

- Elevator colors indicate their current state:

    - Green: moving up
    - Red: moving down
    - Blue: idle
    - Orange: door open

- Passenger count and Pending Requests are updated in real-time.

- Requests Served shows how many passengers have successfully reached their destination.


## Project Structure

   ``` Bash
    ├── frontend
    │   ├── src
    │   │   ├── components
    │   │   │   ├── Elevator.tsx
    │   │   │   ├── Controls.tsx
    │   │   ├── services
    │   │   │   └── socket.ts
    │   │   ├── App.tsx
    │   │   ├── index.css
    │   │   └── styles.css
    │   └── package.json
    ├── backend
    │   ├── simulation.ts
    │   ├── server.ts
    │   ├── types.ts
    │   └── package.json
    └── README.md
  ```
---

## Algorithm Overview

- Each elevator maintains a target queue of floors to visit.
- Requests are assigned to the best elevator based on estimated pickup time.
- Requests waiting more than 30s are escalated in priority.
- Elevators pick up passengers at the requested floor and add their destination floor to the queue.
- Passenger counts are updated dynamically.
- When elevators reach a target floor:
    - Doors open for a set duration
    - Passengers enter/exit
    - Metrics (Requests Served) update accordingly

---

## Performance Metrics

- Real-time Requests Served
- Pending Requests count
- Smooth animations for multiple elevators
- Can handle 100+ simultaneous requests in simulation

---

## Demo

Add screenshots or a short video demonstrating:
  - Elevators moving
  - Doors opening/closing
  - Passenger counts updating
  - Requests Served incrementing
  - Color-coded elevator states

----

## Notes

- Elevator capacity can be adjusted in `simulation.ts`.
- Idle elevators stay at their last position and show IDLE in blue.
- Adjustable simulation speed available in UI controls.