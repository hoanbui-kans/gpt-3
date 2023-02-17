import React, { useEffect, useState } from 'react';
import SideNav from '../components/sideNav';
import Router, { useRouter } from 'next/router';
import { Button  } from 'rsuite';
import styles from '../styles/components.module.css';
import Loading from './Loading';

import { IoArrowForwardCircleOutline, IoArrowBackCircleOutline } from "react-icons/io5";

const Layout = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const router = useRouter();

  useEffect(() =>{
    router.events.on('routeChangeStart', () => {
      setLoading(true)
    })
  
    router.events.on('routeChangeComplete', () => {
      setLoading(false)
    })
  }, [])

  return (
    <>
      <div style={{
        position: 'fixed', 
        height: '100vw', 
        zIndex: 9, 
        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px'}}>
            <Button 
              className={styles.x_toggle_menu_button} 
              onClick={() => setExpanded(!expanded)} 
            >
              <span>Menu</span>
              { !expanded ? <IoArrowForwardCircleOutline size={18} /> : <IoArrowBackCircleOutline size={18} />}
          </Button>
          <SideNav expanded={expanded}/>
      </div>
      <div style={{
          paddingLeft: expanded ? 240 : 66,
      }}>
        {
          loading ? 
            <Loading /> : 
          <>
          {children}
          </>
        }
      </div>
    </>
  )
}

export default Layout