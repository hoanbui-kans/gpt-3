// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import connection from "../../services/database";
import { ErrorAsync } from "../../services/ErrorAsync";
import nc from "next-connect";

export const config = {
    api: {
      bodyParser: true,
    },
}

let responseMessage = { 
    error: true,
    message: 'Đã có lỗi xảy ra, xin vui lòng thử lại sau'
};

const handler = nc(ErrorAsync);

handler.post( async (req, res) => {
        const { message } = req.body; 
        res?.socket?.server?.io?.emit("message", message);
        // return message
        res.status(200).json(message);
    }
)

export default handler 