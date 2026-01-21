import "dotenv/config";

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes";
// import scoreRoutes from "./routes/scoreRoutes";

// Express App
const app = express();

// Middleware
app.use(cors());
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

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});
