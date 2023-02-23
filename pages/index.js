import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useSession, getSession } from 'next-auth/react';
import Router from 'next/router'
import Loading from '../components/Loading';
import BotSideNav from '../components/BotSideNav';
import { Row, Col, Divider, Input, InputGroup, useToaster, Message, Button} from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import Image from 'next/image'
import styles from '../styles/components.module.css';
import SiteIcon from '@rsuite/icons/Site';

const ROOT_URL = process.env.NEXT_PUBLIC_SITE_URL;

const AddDialouge = ({ conservations }) => {

    const { data: session } = useSession()
    const toaster = useToaster();
    const [loading, setLoading] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState(false);
    const [showPanel, setShowPanel] = useState(true);

    useEffect(() => {
      setLoading(true);
    }, [])

    async function addNewConservation(CVTitle){
      if(!CVTitle){
        return toaster.push(
            <Message showIcon type="info">
                Bạn cần đặt tên cho đoạn hội thoại mới này 🙃🙃🙃
            </Message>, 
          { placement: 'topStart' } 
        ) 
      }
      setIsLoading(true);
      const config = {
        url: `${ROOT_URL}/api/conservation`,
        method: "POST",
        headers: {
          'Authorization': `Bearer ${session.token}`
        },
        data: {
          title: CVTitle
        }
      }

      const response = await axios(config).then((res) => {
        toaster.push(
            <Message showIcon type="success">
              { `Đã tạo đoạn hội thoại ${CVTitle}, chúc bạn vui vẻ 😊😊😊!.`}
            </Message>, 
          { placement: 'topStart' } 
        ) 
        return res.data;
      }).catch((error) => {
        toaster.push(
            <Message showIcon type="warning">
                Đã có lỗi xảy ra, xin vui lòng liên hệ Admin để nhận hỗ trợ!
            </Message>, 
          { placement: 'topStart' } 
      ) 
        return null;
      });

      setIsLoading(false);
      
      if(response && response.uuid){
        Router.push(`/chat/${response.uuid}`)
      }
    }

    const [expanded, setExpanded ] = useState(false); 

    function HandleNewExample(message) {
      addNewConservation(message);
    }

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

    return (
      <>
        <main style={{ height: "100vh", padding: 10}}>
              {
                showPanel && 
                <div className={styles.x_fixed_nav}>
                  <BotSideNav activeKey={'index'} conservations={conservations} expanded={expanded} setExpanded={setExpanded}/>
                </div>
              }
            <div className={styles.x_chatbot_container} style={{paddingLeft:  showPanel ?  expanded ? 300 : 100 : 0, height: '100%'}}>
                    {
                      !loading ? 
                      <Loading /> : 
                        <div className={styles.x_add_dialouge}>
                            <div style={{width: '100%'}} className={styles.x_add_dialouge_content}>
                              <h4 style={{textAlign: 'center', marginBottom: 22}}>KANBOT GPT AI</h4>
                              <div className={styles.x_new_dialouge_form} style={{  marginTop: 32}}>
                                <InputGroup inside>
                                    <Input style={{ height: 55, padding: '0px 12px' }} value={title ? title : ""} onChange={(e) => setTitle(e)} placeholder='Nhập tiêu đề hội thoại'/>
                                    <InputGroup.Button style={{ height: 55, background: '#0662f7', color: 'white' }} onClick={() => HandleNewExample(title)} loading={isLoading}>
                                      <PlusIcon style={{marginRight: 6}}/> Thêm mới
                                    </InputGroup.Button>
                                  </InputGroup>
                              </div> 
                              <Button 
                                  onClick={() => setShowPanel(!showPanel)} 
                                  color="ghost" 
                                  style={{margin: '15px 0px', position: 'fixed', top: 10, right: 10}} 
                                  appearance="subtle">
                                  <SiteIcon style={{ marginRight: 5}} width={20} height={20}/> 
                                Menu
                              </Button>
                              <Divider style={{margin: '55px 0px'}}/> 
                              <Row style={{width: '100%'}} gap={3}>
                                  <Col xs={24} md={24}>
                                      <Image style={{marginBottom: 15}} src="/Logo.png" alt="kanbox.vn" width={120} height={38}/>
                                      <h6 className={styles.x_dialouge_icon_title}>VỀ CHÚNG TÔI</h6>
                                      <p>Kan Solution là đơn vị chuyên cung cấp các giải pháp thiết kế, xây dựng website trọn gói - theo yêu cầu của khách hàng.</p>
                                      <ul className={styles.x_footer_address_list}>
                                          <li>
                                            <div className={styles.x_contact_list}>
                                              <span className={styles.x_footer_icon}>
                                                <Image alt='layout' src={'/icons/Pin_fill.svg'} width={24} height={24}/>
                                              </span>
                                              <div>
                                                <p>
                                                  <strong className={styles.x_footer_focused}> 
                                                    Địa chỉ: 
                                                  </strong>
                                                </p>
                                                <p>Tầng 4 Block A Centana Thủ Thiêm, P. An Phú, TP. HCM</p>
                                              </div>
                                            </div>
                                            </li>
                                            <li>
                                            <div className={styles.x_contact_list}>
                                              <span className={styles.x_footer_icon}>
                                                  <Image alt='layout' src={'/icons/Phone_fill.svg'} width={24} height={24}/>
                                              </span>
                                              <div>
                                                <p>
                                                  <strong className={styles.x_footer_focused}>
                                                  Hotline: 
                                                  </strong>
                                                </p>
                                                <p>  
                                                  <a href={'tel:0392193639'}>
                                                    039 219 3639
                                                  </a>
                                                </p>
                                              </div>
                                            </div>
                                            </li>
                                            <li>
                                            <div className={styles.x_contact_list}>
                                              <span className={styles.x_footer_icon}>
                                                  <Image alt='layout' src={'/icons/Message_alt.svg'} width={24} height={24}/>
                                              </span>
                                              <div>
                                                <p>
                                                  <strong className={styles.x_footer_focused}>
                                                    Email: 
                                                  </strong>
                                                </p>
                                                <p> 
                                                  <a href={'mailto:info@kanbox.vn'}>
                                                    info@kanbox.vn
                                                  </a>
                                                </p>
                                              </div>
                                            </div>
                                          </li>
                                        </ul>
                                  </Col>
                                </Row>
                            </div>
                        </div>
                    }
              </div>
          </main>
      </>
  )
}

export default AddDialouge;

export async function getServerSideProps (context) {
  const session = await getSession(context);

  if (!session) return {
    redirect: {
      destination: '/dang-nhap/'
    }
  }

  const ROOT_URL = process.env.NEXT_PUBLIC_SITE_URL;

  if(!session) return {
    props: {
      conservations: null
    }
  };

  const config = {
    url: `${ROOT_URL}/api/conservation`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${session.token}`
    }
  }

  const conservations = await axios(config).then((res) => res.data).catch((err) => {
    return []
  });

  return {
    props: {
      conservations: conservations
    }
  }
}