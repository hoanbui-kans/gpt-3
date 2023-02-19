import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import axios from 'axios';
import io from "socket.io-client";
import { useSession, getSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/router'
import { v4 as uuidv4 } from 'uuid';
import HTMLReactParser from 'html-react-parser';
import Loading from '../../components/Loading';
import BotSideNav from '../../components/BotSideNav';
import { 
  ChatContainer, ConversationHeader, 
  TypingIndicator, Message,
  MessageInput, MessageList, Avatar 
} from '@chatscope/chat-ui-kit-react'
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import styles from '../../styles/components.module.css';

import BotAvatar from '../../public/bot-avatar.jpg';
import UserAvatar from '../../public/user-avatar.jpg';

const ROOT_URL = process.env.NEXT_PUBLIC_SITE_URL;

const ChatDialouge = ({ conservations, data }) => {

    const socket = useRef();
    const session = useSession();
    const router = useRouter();

    const { uuid } = router.query; 
    const [loading, setLoading] = useState(null);

    useEffect(() => {
      async function initializeSocket () {
        await fetch('/api/socket');
      }

      socket.current = io();
      
      initializeSocket();

      socket.current.on('connect', () => {
        console.log('connected')
      });

      socket.current.on(uuid, (msg) => {
        const newMessage = msg.message.replace(/^\n/, "");
        setTypingResponse({
          id: msg.id,
          message: HTMLReactParser(newMessage),
          sender: 'Kanbot AI',
          direction: "incoming",
          position: "last",
          type: "text"
        })
      });
    }, [])

    useEffect(() => {
      setLoading(true);
    }, [])

    useEffect(() => {
      if(loading){
        if(!session && !session.token){
          router.push({
            pathname: '/dang-nhap'
          })
        }
      }
    }, [session])

    const [expanded, setExpanded ] = useState(true); 
    const [value, setValue ] = useState(""); 
    const [chatState, setChatState] = useState( data ? data.messages : []);
    const [conservation, setConservation] = useState(null); 
    const [typingResponse, setTypingResponse] = useState(null);
    const [typing, setTyping] = useState(false);

    async function HandleSendMessage (message) {
      setTyping(true);
      const messageId = uuidv4();

      let data = conservation !== null ? { 
        ...conservation,
        id: messageId,
        message: message,
        conservation: uuid
      } : {
        id: messageId,
        message: message,
        conservation: uuid
      }

      const config = {
        url: `${ROOT_URL}/api/kanbot/response`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.data.token}`
        },
        data: data
      }  

      const response = await axios(config).then((res) => res.data).catch((err) => {
        return null
      })
      
      if(response){
        const responseBotMessage = await createMessage({
          id: response.id,
          message: response.text,
          direction: "incoming",
          type: "text"
        });
        if(responseBotMessage){
          let newState = chatState;
          newState.push({
            id: response.id,
            message: response.text,
            sender: 'Bot ai',
            direction: "incoming",
            position: "last",
            type: "text"
          });
          setChatState(newState);
          setConservation({
            conversationId: response.conversationId,
            parentMessageId: response.parentMessageId 
          })
        }
      }
      
      setTypingResponse(false);
      setTyping(false);
  }

  async function HandleAddMessage(message) {
      setValue("");
      const uuid = uuidv4();
      let newState = chatState;
      const newMessage = await createMessage({ 
        id: uuid,
        message: message,
        direction: "outgoing",
        type: "text"
      }); 

      if(newMessage){
        newState.push({
            id: uuid,
            message: HTMLReactParser(message),
            sender: "user",
            direction: "outgoing",
            position: "last",
            type: "text"
        });
        setChatState(newState);
        await HandleSendMessage(message);
      }
  }

  const hanleChangeInput = (e) => {
    setValue(e);
  }

  async function createMessage (message) {
    const config = {
      url: '/api/messages',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.data.token}`
      },
      data: {
        uuid: message.id,
        message: message.message,
        conservation: uuid,
        direction: message.direction,
        type: message.type
      }
    }  

    const response = await axios(config).then((res) => res.data).catch((err) => {
      return null
    });

    return response;
  }

  return (
    <>
      <Head>
        <title>Kanbot AI chat app</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ height: "100vh", padding: 10}}>
          <div className={styles.x_fixed_nav}>
            <BotSideNav activeKey={uuid} conservations={conservations} expanded={expanded} setExpanded={setExpanded}/>
          </div>
          <div style={{paddingLeft: expanded ? 300 : 100, height: '100%'}}>
                  {
                    !loading ? 
                    <Loading /> : 
                    <ChatContainer>
                          <ConversationHeader>
                              <ConversationHeader.Content userName={'Kanbot AI'} info="Version 1.0.3" />   
                              <ConversationHeader.Actions>
                              </ConversationHeader.Actions>          
                          </ConversationHeader> 
                            <MessageList typingIndicator={ typing ? <TypingIndicator content={`Kanbot AI đang nhập`} /> : ""}>
                                {
                                  chatState.length ? chatState.map((val) => {
                                          if(val.message != ''){
                                            console.log(val);
                                            return(
                                                <Message key={val.id} model={val}>
                                                    { 
                                                      val.direction == 'incoming' ?
                                                        <Avatar src={BotAvatar.src} name={"Bot"} size="md" />
                                                      : <Avatar src={UserAvatar.src} name={"You"} size="md" />
                                                    }
                                                </Message>
                                            )
                                          }
                                      }) : ""
                                }
                                { 
                                  typingResponse && 
                                    <Message model={typingResponse}>
                                      <Avatar src={BotAvatar.src} name={"Bot"} size="md" />
                                    </Message>
                                }
                            </MessageList>
                           <MessageInput 
                              onSend={HandleAddMessage}  
                              placeholder="Nhập nội dung của bạn"
                              attachButton={false} 
                              onChange={hanleChangeInput} 
                              value={value}
                              onPaste={(evt) => {
                                  evt.preventDefault();
                                  setValue(evt.clipboardData.getData("text"));
                              }}
                          />
                      </ChatContainer>
                  }
            </div>
        </main>
    </>
  )
}

export default ChatDialouge;

export async function getServerSideProps (context) {

  const session = await getSession(context);
  const { uuid } = context.params
  
  if(!session) return {
    props: {
      conservations: null
    }
  };

  const allConservations = {
    url: `${ROOT_URL}/api/conservation`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${session.token}`
    }
  }

  const AllConservations = await axios(allConservations).then((res) => res.data).catch((err) => {
    return []
  });

  const curentConservation = {
    url: `${ROOT_URL}/api/conservation/${uuid}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${session.token}`
    }
  }

  const conservation = await axios(curentConservation).then((res) => res.data).catch((err) => {
    return null
  });

  return {
    props: {
      conservations: AllConservations,
      data: conservation
    }
  }
}