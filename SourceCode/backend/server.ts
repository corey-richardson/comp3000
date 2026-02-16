import "dotenv/config";

import cors from "cors";
import express, { Request, Response, NextFunction } from "express";

import authRoutes from "./routes/auth";
import contactsRoutes from "./routes/contactsRoutes";
import profileRoutes from "./routes/profileRoutes";
import roundRoutes from "./routes/roundRoutes";
import scoreRoutes from "./routes/scoreRoutes";
import userRoutes from "./routes/userRoutes";

// Express App
const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:81"
}));

app.use(express.json());

// Request Logging
app.use((request: Request, response: Response, next: NextFunction) => {
    // eslint-disable-next-line no-console
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
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/rounds", roundRoutes);
app.use("/api/contacts", contactsRoutes);

app.use((request: Request, response: Response) => {
    response.status(404).json({ error: "Route Not Found!" });
});

app.use((error: Error, request: Request, response: Response) => {
    // eslint-disable-next-line no-console
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${PORT}.`);
});
