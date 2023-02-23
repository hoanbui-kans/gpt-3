import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import axios from 'axios';
import io from "socket.io-client";
import { Button } from 'rsuite';
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
import SiteIcon from '@rsuite/icons/Site';
import BotAvatar from '../../public/bot-avatar.jpg';
import UserAvatar from '../../public/user-avatar.jpg';

import { useToaster } from 'rsuite';
import Toaster from './Toaster';

const ROOT_URL = process.env.NEXT_PUBLIC_SITE_URL;

const ChatDialouge = ({ conservations, data }) => {

    const socket = useRef();
    const session = useSession();
    const router = useRouter();

    const { uuid } = router.query; 
    const toaster = useToaster();

    const [loading, setLoading] = useState(null);
    const [showPanel, setShowPanel] = useState(true);
    const [expanded, setExpanded ] = useState(true); 
    const [value, setValue ] = useState(""); 
    const [chatState, setChatState] = useState([]);

    const [conservation, setConservation] = useState(false); 

    const [typingResponse, setTypingResponse] = useState(false);
    const [typing, setTyping] = useState(false);

    useEffect(() =>{
      if(data){
        setLoading(true);
        setChatState(data.messages);
      }
    }, [data]);

    useEffect(() => {
      if(Array.isArray(chatState) && chatState.length){
        setConservation({
            conversationId: uuid,
            parentMessageId: chatState[chatState.length - 1].uuid
        })
      }
    }, [chatState]);


    useEffect(() => {

      socket.current = io();

      async function initializeSocket () {
        await axios.get(`${ROOT_URL}/api/socket`).then((res) => res.data).catch((err) => {
          return null
        });
      }

      initializeSocket();

      socket.current.on('connect', () => {
        console.log('Kanbox GPT AI connected')
      });

      socket.current.on(uuid, (msg) => {
        const newMessage = msg.message.replace(/^\n/, "");
        setTypingResponse({
          id: msg.id,
          message: HTMLReactParser(newMessage),
          sender: 'Kanbot GPT AI',
          direction: "incoming",
          position: "last",
          type: "text"
        })
      });

      socket.current.on(`${uuid}-off`, () => {
        setTypingResponse(false);
      });
    }, [])

    useEffect(() => {
      if(typeof window != 'undefined'){
          function handleResize() {
            if( window.innerWidth <= 768 ) {
              setShowPanel(false);
            } else {
              setShowPanel(true);
            }
          }
          handleResize();
          window.addEventListener('resize', handleResize)
      }
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

    
    async function HandleSendMessage (message) {
      try {
        setTyping(true);
        const messageId = uuidv4();
        let data = {
          id: messageId,
          message: message,
          parentMessageId: conservation.parentMessageId,
          conservation: conservation.conversationId
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
          return false
        });

        if(!response){
          toaster.push(
            <Toaster type="error" message="Đã có lỗi không mong muốn xảy ra"/>,
            { placement : 'topStart'}
          )
        }
        
        if(response.error){
          toaster.push(
            <Toaster type="error" message={response.message}/>,
            { placement : 'topStart'}
          )
        } else {
          let newState = chatState;
          newState.push({
              id: response.id,
              message: response.text,
              sender: 'Kanbot GPT AI',
              direction: "incoming",
              position: "last",
              type: "text"
          });
  
          setChatState(newState);
          
          setConservation({
            conversationId: response.conversationId,
            parentMessageId: response.id 
          })
  
          await createMessage({
            id: response.id,
            parentMessageId: response.id,
            message: response.text,
            direction: "incoming",
            type: "text"
          });
        }
        
        
        setTyping(false);
      } catch (error) {
        return null
      }
  }

  async function HandleAddMessage(message) {
      try {
        setValue("");
        const uuid = uuidv4();
        let newState = chatState;

        const newMessage = await createMessage({ 
          id: uuid,
          parentMessageId: conservation.parentMessageId,
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
      } catch (error) {
        return null
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
          {
            showPanel && 
            <div className={styles.x_fixed_nav}>
              <BotSideNav activeKey={uuid} conservations={conservations} expanded={expanded} setExpanded={setExpanded}/>
            </div>
          }
          <div className={styles.x_chatbot_container} style={{paddingLeft: showPanel ? expanded ? 300 : 100 : 0, height: '100%'}}>
                  {
                    !loading ? 
                    <Loading /> : 
                    <ChatContainer>
                          <ConversationHeader>
                              <ConversationHeader.Content userName={'Kanbot GPT AI'} info="Version 1.0.3" />   
                              <ConversationHeader.Actions>
                                  <Button onClick={() => setShowPanel(!showPanel)} color="blue" className={styles.x_light_primary} appearance="primary"><SiteIcon width={20} height={20}/> Menu</Button>
                              </ConversationHeader.Actions>          
                          </ConversationHeader> 
                            <MessageList typingIndicator={ typing ? <TypingIndicator content={`Kanbot GPT AI đang nhập`} /> : ""}>
                                {
                                  Array.isArray(chatState) && chatState.length ? 
                                  chatState.map((val) => {
                                            if(val.message != ''){
                                              return(
                                                  <Message key={val.id} model={val}>
                                                      { 
                                                        val.direction == 'incoming' ?
                                                          <Avatar src={BotAvatar.src} name={"Bot"} size="md" status="available"/>
                                                        : <Avatar src={UserAvatar.src} name={"You"} size="md" status="available"/>
                                                      }
                                                  </Message>
                                              )
                                            }
                                        }) : ""
                                  }
                                  { 
                                    typingResponse ? 
                                      <Message model={ typingResponse }>
                                        <Avatar src={BotAvatar.src} name={"Bot"} size="md" status="available"/>
                                      </Message> : ""
                                  }
                           </MessageList>
                           <MessageInput 
                              onSend={HandleAddMessage}  
                              placeholder="Nhập nội dung của bạn"
                              attachButton={false} 
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
    redirect: {
      destination: '/dang-nhap/'
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