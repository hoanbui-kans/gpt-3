import React, { useState } from 'react'
import { Nav } from 'rsuite'
import Link from 'next/link'
import styles from '../../styles/components.module.css'
import { useRouter } from 'next/router'

const Navbar = ({ active, bot_id, onSelect, ...props }) => {
  return (
    <Nav {...props} activeKey={active} onSelect={onSelect} style={{ paddingLeft: 150 }}>
        <Link href={`/chatbot/${bot_id}`}><Nav.Item eventKey='chatbot' as={'a'}>Bot</Nav.Item></Link>
        <Link href={`/chatbot/${bot_id}/intents`}><Nav.Item eventKey='intents' as={'a'}>Ý định</Nav.Item></Link>
        <Link href={`/chatbot/${bot_id}/entities`}><Nav.Item eventKey='entities' as={'a'}>Đối tượng</Nav.Item></Link>
        <Link href={`/chatbot/${bot_id}/conversation/`}><Nav.Item eventKey='conversation' as={'a'}>Hội thoại</Nav.Item></Link>
        <Link href={`/chatbot/${bot_id}/settings`}><Nav.Item eventKey='setting' as={'a'}>Cài đặt</Nav.Item></Link>
        <Link href={`/chatbot/${bot_id}/chat-virtual`}><Nav.Item eventKey='chat-virtual' as={'a'}>Mô phỏng chat</Nav.Item></Link>
    </Nav>
  );
};


const ChatbotBreadcumbs = ({ bot_id }) => {
  const { asPath } = useRouter();
  let activeKey = asPath.split("/");
  const [active, setActive] = useState( activeKey[2] ? activeKey[2] : 'chatbot');
  return (
    <Navbar appearance="subtle" bot_id={bot_id} reversed active={active} onSelect={setActive} />
  )
}

export default ChatbotBreadcumbs