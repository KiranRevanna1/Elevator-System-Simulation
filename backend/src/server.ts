import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Simulation } from './simulation';

const app = express();

const allowedOrigins = [
  "https://elevator-system-simulation.vercel.app", 
  "http://localhost:3000"                          
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"]
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

const sim = new Simulation(10, 3); // 10 floors, 3 elevators

app.get('/', (req, res) => res.send('Elevator backend is running!'));

app.post('/control/start', (req, res) => { sim.start(); res.json({ ok: true }); });
app.post('/control/stop', (req, res) => { sim.stop(); res.json({ ok: true }); });
app.post('/control/reset', (req, res) => { sim.reset(); res.json({ ok: true }); });


app.post('/request', (req, res) => {
  const { origin, destination } = req.body;
  sim.addExternalRequest(origin, destination);
  res.json({ ok: true });
});


io.on('connection', (socket) => {
  console.log('Client connected', socket.id);
  const handle = setInterval(() => {
    socket.emit('state', sim.getState());
  }, 500);

  socket.on('disconnect', () => clearInterval(handle));
  socket.on('close', () => clearInterval(handle));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
