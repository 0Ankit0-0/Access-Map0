import express from "express";
import http from "http";
import Incident from "./models/Incident.js";
import { Server as socketIo } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import incidentRoutes from "./routes/incident.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from your frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  },
});

// Inject io into every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/incident", incidentRoutes); // Updated to /incident
app.use("/api/auth", authRoutes);

app.get('/api/incidents', async (req, res) => {
  try {
    // Fetch all incidents from the database
    const incidents = await Incident.find();  // You can add query params for filtering
    res.status(200).json(incidents);  // Send the data as a JSON response
  } catch (err) {
    console.error('Error fetching incidents:', err);
    res.status(500).json({ message: 'Server error while fetching incidents.' });
  }
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Mongo connection and server start
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const PORT = process.env.PORT || 5001;
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
