import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import liveRoutes from "./routes/liveRoutes.js"; // Include .js
import standingsRoutes from "./routes/standingsRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";
import fixturesRoutes from "./routes/fixturesRoutes.js"
import uclRoutes from './routes/uclRoutes.js'
import bplRoutes from './routes/bplRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send(`Server is running on port ${PORT}`);
});

// API routes
app.use("/api/live-matches", liveRoutes);

app.use("/api/standings", standingsRoutes);


app.use("/api/competitions", competitionRoutes);

app.use('/api/fixtures', fixturesRoutes);

app.use('/api/ucl', uclRoutes);
app.use('/api/bpl', bplRoutes)


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
