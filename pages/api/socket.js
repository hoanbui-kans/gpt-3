import { Server } from 'socket.io'
import { ErrorAsync } from "../../services/ErrorAsync";
import nc from "next-connect";

export const config = {
    api: {
      bodyParser: true,
    },
}

const handler = nc(ErrorAsync);

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io
  } else {
    res.status(200).json({
      message: 'socket.io already running'
    })
  }
  res.end()
}

handler.get(ioHandler).post(ioHandler);

export default handler