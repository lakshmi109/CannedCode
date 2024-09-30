import dotenv from "dotenv"
dotenv.config()
import express from "express";
import { createServer } from "http";
import { initializeWebSocket } from "./web_sockets";
import { initHttp } from "./http";
import cors from "cors";

const app = express();
app.use(cors());
const httpServer = createServer(app);

initializeWebSocket(httpServer);
initHttp(app);

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});