// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import connection from "../../../services/database";
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
        const { message } = req.body; 
        if(!req.session){
            return res.status(403).json(responseMessage)
        } else {
           try {
            const api = new ChatGPTAPI({
                    apiKey: process.env.NEXT_PUBLIC_OPEN_API_KEY
            })

            const response = await api.sendMessage( message  + ' trả lời bằng tiếng việt', {
                conversationId: res.conversationId,
                parentMessageId: res.id,
                onProgress: (partialResponse) => {
                    console.log(partialResponse.text);
                }
            });

            return res.status(200).json({
                message: response.text,
                conversationId: response.conversationId,
                parentMessageId: response.parentMessageId
            });

           } catch (error) {
                console.log('error:', error)
                return res.status(403).json({ 
                    error: true,
                    message: error
                })
           }
        }
    }
)

export default handler 