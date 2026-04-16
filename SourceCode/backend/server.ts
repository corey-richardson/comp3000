import "dotenv/config";

import cors from "cors";
import express, { Request, Response, NextFunction } from "express";

import authRoutes from "./routes/auth";
import clubRoutes from "./routes/clubRoutes";
import contactsRoutes from "./routes/contactsRoutes";
import inviteRoutes from "./routes/inviteRoutes";
import membershipRoutes from "./routes/membershipRoutes";
import profileRoutes from "./routes/profileRoutes";
import roundRoutes from "./routes/roundRoutes";
import scoreRoutes from "./routes/scoreRoutes";
import userRoutes from "./routes/userRoutes";

// Express App
const app = express();
app.use(express.json());

// Middleware
app.use(cors({
    origin: "http://localhost:81"
}));

// Health Test Route
app.get("/api/health", (request: Request, response: Response) => {
    response.status(200).json({
        backend: "Online!",
    });
});

// Request Logging
app.use((request: Request, response: Response, next: NextFunction) => {
    // eslint-disable-next-line no-console
    console.log(`${request.method} ${request.path}`);
    next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/clubs", membershipRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/rounds", roundRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/users", userRoutes);

// Error Handling
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
