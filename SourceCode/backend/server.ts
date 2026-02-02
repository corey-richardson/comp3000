import "dotenv/config";

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes";
import profileRoutes from "./routes/profileRoutes";
import scoreRoutes from "./routes/scoreRoutes";

// Express App
const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:81"
}));

app.use(express.json());

// Request Logging
app.use((request: Request, response: Response, next: NextFunction) => {
    console.log(`${request.method} ${request.path}`);
    next();
});

// Smoke Test Route
app.get("/smoke-test", (request: Request, response: Response) => {
    response.json({
        backend: "Online!",
    });
});

// Routes
// app.use("/api/scores", scoreRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/scores", scoreRoutes);

app.use((request: Request, response: Response) => {
    response.status(404).json({ error: "Route Not Found!" });
});

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});
