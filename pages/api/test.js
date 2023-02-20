import { ChatGPTAPI } from "chatgpt"
import { ErrorAsync } from "../../services/ErrorAsync";
import nc from "next-connect";

const handler = nc(ErrorAsync);


handler.get(async (req, res) => {
    
    const api = new ChatGPTAPI({ apiKey: process.env.NEXT_PUBLIC_OPEN_API_KEY })

    let texts = [];
    // send a message and wait for the response
    let response = await api.sendMessage('xin chào bạn')

    texts.push(response)

    // send a follow-up
    response = await api.sendMessage('tôi đã chào bạn chưa', {
        conversationId: response.conversationId,
        parentMessageId: response.id
    })

    texts.push(response)
    // send another follow-up
    response = await api.sendMessage('bạn đã chào tôi chưa', {
        conversationId: response.conversationId,
        parentMessageId: response.id
    })

    texts.push(response)

    return res.json(texts)
})


export default handler;