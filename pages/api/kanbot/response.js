// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ErrorAsync } from "../../../services/ErrorAsync";
import JwtMiddleWare from "../jwt";
import nc from "next-connect";
import { ChatGPTAPI } from 'chatgpt'

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
 
handler.use(JwtMiddleWare);

handler.post( async (req, res) => {
        const { id, conservation, message, parentMessageId } = req.body; 
    
        if(!req.session){
            return res.status(403).json(responseMessage)
        } else {
           try {
            const api = new ChatGPTAPI({
                apiKey: process.env.NEXT_PUBLIC_OPEN_API_KEY
            })
            const response = await api.sendMessage( message, {
                conversationId: conservation,
                parentMessageId: parentMessageId, 
                onProgress: (partialResponse) => {
                    res?.socket?.server?.io?.emit( conservation, {
                        id: id,
                        message: partialResponse.text
                    });
                }
            });

            return res.status(200).json(response);

           } catch (error) {
                return res.status(403).json({ 
                    error: true
                 })
           }
        }
    }
)

export default handler 