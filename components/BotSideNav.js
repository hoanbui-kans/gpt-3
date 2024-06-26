import { useState } from 'react'; 
import { Sidebar, Sidenav, Navbar, Nav } from 'rsuite';
import Link from 'next/link';
import Image from 'next/image';
import NoticeIcon from '@rsuite/icons/Notice';
import styles from '../styles/components.module.css';
import ScrollContainer from 'react-indiana-drag-scroll';
import AngleLeftIcon from '@rsuite/icons/legacy/AngleLeft';
import AngleRightIcon from '@rsuite/icons/legacy/AngleRight';
import MessageIcon from '@rsuite/icons/Message';
import PlusIcon from '@rsuite/icons/Plus';
import { signOut } from "next-auth/react"

const NavToggle = ({ expanded, onChange }) => {
  return (
    <Navbar appearance="subtle" className="nav-toggle">
      <Nav>
        <Nav.Menu
            noCaret
            placement="topStart"
            trigger="click"
            title={<NoticeIcon />}
          >
          <Nav.Item as="span">
            <a rel="noreferrer" target="_blank" href="https://kanbox.vn/gioi-thieu/">Giới thiệu</a>
          </Nav.Item>
          <Nav.Item onClick={() => signOut()}>
               Đăng xuất
          </Nav.Item>
        </Nav.Menu>
      </Nav>

      <Nav pullRight>
        <Nav.Item onClick={onChange} style={{ width: 56, textAlign: 'center' }}>
          {expanded ? <AngleLeftIcon /> : <AngleRightIcon />}
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

const BotSideNav = ({ conservations, activeKey, expanded, setExpanded}) => {
    const [active, setActive] = useState(activeKey);
    return (
        <div className={styles.x_side_nav_container}>
              <Sidebar
                    style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                    }}
                    width={expanded ? 260 : 56}
                    collapsible
                  >
                  <ScrollContainer 
                    style={{maxHeight: !expanded ? 'calc(100vh - 170px)' : 'calc(100vh - 150px)', marginTop: 55, padding: '35px 0px'}}>
                      <Sidenav 
                          appearance="subtle"
                          color='primary'
                          reversed
                          expanded={expanded}
                          >
                          <Sidenav.Header>
                              <div className={styles.x_side_nav_brand}>
                                    <a rel="noreferrer" style={{textAlign: 'center'}} href="https://kanbox.vn" target="_blank">
                                        {
                                          ! expanded ? 
                                            <Image src="/favicon.png" alt="kanbox.vn" width={34} height={34}/>: 
                                            <span className={styles.x_site_logo}>
                                              <Image src="/Logo.png" alt="kanbox.vn" width={120} height={38}/>
                                            </span>
                                        }
                                    </a>
                              </div>
                          </Sidenav.Header>
                          <Sidenav.Body>
                            <Nav appearance="subtle"  activeKey={active} onSelect={setActive}>
                              <Nav.Item href={`/`} className={styles.x_add_conservation} as={Link} icon={<PlusIcon />} eventKey={'index'}>
                                Tạo hội thoại
                              </Nav.Item>
                              {
                                Array.isArray(conservations) && conservations.length ? 
                                  conservations.map((val) => {
                                    return(
                                        <Nav.Item href={`/chat/${val.uuid}`} className={styles.x_conservation_item} as={Link} key={val.id} icon={<MessageIcon />} eventKey={val.uuid}>
                                            {val.title}
                                        </Nav.Item>
                                    )
                                  })
                                : ""
                              }
                            </Nav>
                          </Sidenav.Body>
                      </Sidenav>
                  </ScrollContainer>
                  <NavToggle expanded={expanded} onChange={() => setExpanded(!expanded)} />
              </Sidebar>
        </div>
    );
  };

  export default BotSideNav;