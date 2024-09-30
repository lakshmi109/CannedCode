import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { fetchGCSFolder, saveToGCS } from "./google_cloud"; 
import path from "path";
import { fetchDirectoryContents, readFileContent, writeFile  } from "./file_system";
import { TerminalManager } from "./pseudo_terminal";

const terminalManager = new TerminalManager();

/**
 * Sets up handlers for socket events like file operations, terminal management, etc.
 * @param {Socket} socket - The WebSocket connection object.
 * @param {string} userId - The unique identifier of the connected user.
 */
function setupSocketHandlers(socket: Socket, userId: string) {

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("fetchDir", async (dir: string, callback) => {
        const dirPath = path.join(__dirname, `../tmp/${userId}/${dir}`);
        const contents = await fetchDirectoryContents(dirPath, dir);
        callback(contents);
    });

    socket.on("fetchContent", async ({ path: filePath }: { path: string }, callback) => {
        const fullPath = path.join(__dirname, `../tmp/${userId}/${filePath}`);
        const data = await readFileContent(fullPath);
        callback(data);
    });

    socket.on("updateContent", async ({ path: filePath, content }: { path: string, content: string }) => {
        const fullPath = path.join(__dirname, `../tmp/${userId}/${filePath}`);
        await writeFile(fullPath, content);

        await saveToGCS(`code/${userId}`, filePath, content);
    });

    socket.on("requestTerminal", async () => {
        terminalManager.createPty(socket.id, userId, (data, id) => {
            socket.emit('terminal', {
                data: Buffer.from(data, "utf-8")
            });
        });
    });
    
    socket.on("terminalData", async ({ data }: { data: string, terminalId: number }) => {
        terminalManager.write(socket.id, data);
    });

}

/**
 * Initialize WebSocket connection for handling real-time events.
 * @param {HttpServer} httpServer - The HTTP server to attach WebSocket to.
 */
export function initializeWebSocket(httpServer: HttpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
      
    io.on("connection", async (socket) => {
        const userId = socket.handshake.query.roomId as string;
        // If no userId is provided, disconnect the socket and clear the terminal.
        if (!userId) {
            socket.disconnect();
            terminalManager.clear(socket.id);
            return;
        }

        console.log("user connected", userId);

        console.log("fetching directory", `code/${userId}`, path.join(__dirname, `../tmp/${userId}`))

        await fetchGCSFolder(`code/${userId}`, path.join(__dirname, `../tmp/${userId}`));
        socket.emit("loaded", {
            rootContent: await fetchDirectoryContents(path.join(__dirname, `../tmp/${userId}`), "")
        });

        setupSocketHandlers(socket, userId);
    });
}
