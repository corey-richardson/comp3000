import { Request, Response } from "express";

export const getRoundsList = async (request: Request, response: Response) => {
    try {
        const serviceResponse = await fetch(process.env.FLASK_ARCHERYUTILS_SERVICE_URL + "/rounds");
        const data = await serviceResponse.json();
        response.status(200).json(data);
    } catch (error: any) {
        response.status(500).json({ error: "Internal Server Error: " + error.message });
    }
};
