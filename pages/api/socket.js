import { Server } from 'socket.io'
import { ErrorAsync } from "../../services/ErrorAsync";
import { createServer } from "http";
import nc from "next-connect";

export const config = {
    api: {
      bodyParser: true,
    },
}

const handler = nc(ErrorAsync);

const ioHandler = (req, res) => {
  const httpServer = createServer();
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    io.on('connection', socket => {
      socket.broadcast.emit('a user connected')
    })
    res.socket.server.io = io
  } else {
    console.log('socket.io already running')
  }
  res.end()
}

handler.post(ioHandler);
handler.get(ioHandler);

export default handler