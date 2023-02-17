import { useState } from 'react'; 
import { Sidenav, Nav, Toggle, Avatar } from 'rsuite';
import Link from 'next/link';
import Image from 'next/image';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import styles from '../styles/components.module.css';
import ScrollContainer from 'react-indiana-drag-scroll'
import {
  VscBroadcast,
  VscTerminal,
  VscSymbolMethod,
  VscVm,
  VscTypeHierarchy,
  VscHubot,
  VscRocket,
  VscAccount,
  VscFileSymlinkDirectory,
  VscLibrary,
  VscBell
} from "react-icons/vsc";

import { Button } from 'rsuite';
import { IconButton } from 'rsuite';
import { useSession } from 'next-auth/react';

const NavTitle = ({name, expanded}) => {
  return expanded ? name : "";
}

const X_Nav_Item = ({ url, icon, title, expanded}) => {
  return (
    <div className={styles.side_nav_item}>
      <Link href={url}>
          <a>
              <span className={styles.x_nav_icon}>
                 { icon }
              </span>
              <NavTitle name={title} expanded={expanded} />
          </a>
      </Link>
    </div>
  )
}

const Navbar = ({ active, onSelect, ...props }) => {
  return(
    <></>
  )
}


const SideNav = ({ expanded }) => {
    const { data: session } = useSession();
    const [active, setActive] = useState('1');
    return (
      <div 
        style={{ 
          width: expanded ? 240 : 66 ,
        }}>
        <div className={styles.x_side_nav_container}>
            <ScrollContainer className={styles.x_side_nav_body} overscroll={false} ignoreElements={'.rs-dropdown-menu'}>
                <Sidenav 
                    appearance="subtle"
                    color='primary'
                    reversed
                    expanded={expanded}>
                    <Sidenav.Header>
                        <div className={styles.x_side_nav_brand}>{
                              ! expanded ? 
                                <Image src="/icon.svg" alt="" width={40} height={40}/>: 
                                <Image src="/logo.svg" alt="" width={120} height={40}/>
                              }
                        </div>
                    </Sidenav.Header>
                    <Sidenav.Body>
                      <Navbar appearance="subtle" reversed active={active} onSelect={setActive} />
                    </Sidenav.Body>
                  </Sidenav>
            </ScrollContainer >
            <div className={styles.x_side_nav_footer_menu}>
              <Sidenav expanded={expanded} defaultOpenKeys={['3', '4']}>
                  <Sidenav.Body>
                    <Nav>
                      <Nav.Item eventKey="2" icon={<VscBell />}>
                        Tổng quan
                      </Nav.Item>
                      <Nav.Item eventKey="2" icon={<Avatar size="sm" circle src="https://avatars.githubusercontent.com/u/8225666" alt="@SevenOutman" />}>
                        Người dùng
                      </Nav.Item>
                    </Nav>
                  </Sidenav.Body>
                </Sidenav>
            </div>
        </div>
      </div>
    );
  };

  export default SideNav;