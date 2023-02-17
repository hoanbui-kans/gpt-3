import { Server } from "socket.io";
import nc from "next-connect";
import { Socket } from "socket.io-client";
import http from "http";

export const config = {
  api: {
    bodyParser: true,
  },
}

const ioHandler = (req, res) => {
  
  const httpServer = http.createServer();

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    socket.on("connect", (data) => {
      io.emit("connect", data);
    });

    socket.on("message", (data) => {
      console.log("message received:", data);
      io.emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  res.end();
};

export default nc().get(ioHandler).post(ioHandler);