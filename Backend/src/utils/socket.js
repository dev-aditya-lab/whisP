import { Server } from "socket.io";

let ioInstance = null;

export function initSocket(server, options = {}) {
    ioInstance = new Server(server, options);

    ioInstance.on("connection", (socket) => {
        // Expect client to join a chat room with chatId
        socket.on("chat:join", (chatId) => {
            if (!chatId) return;
            socket.join(`chat:${chatId}`);
        });

        socket.on("chat:leave", (chatId) => {
            if (!chatId) return;
            socket.leave(`chat:${chatId}`);
        });
    });

    return ioInstance;
}

export function getIO() {
    if (!ioInstance) {
        throw new Error("Socket.IO not initialized");
    }
    return ioInstance;
}


