import { useRef, useState } from 'react'
import { 
  Container, Row, Col, 
  Form,InputGroup, Button, 
  Schema, Loader, Message, 
  useToaster, 
  Divider
} from 'rsuite'
import Link from 'next/link'
import styles from '../styles/account.module.css';
import { IoEyeOutline, IoEyeOffOutline, IoHomeOutline } from "react-icons/io5";
import { useSession, signIn, signOut } from "next-auth/react"
import { useOneTapSignin } from '../components/useOneTapSignin';
import SocialButton from '../components/SocialButton';
import Image from 'next/image';
import Script from 'next/script';
import { TypeAnimation } from 'react-type-animation';

const Component = () => {
  const { isLoading } = useOneTapSignin({
    redirect: false,
    parentContainerId: 'googleAuthenticator',
  });
  return (
    <div id="googleAuthenticator" style={{ position: 'fixed', top: '100px', right: '10px', zIndex: 999 }} />
  );
};

const Login = () => {

  const toaster = useToaster();
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const handleChange = () => {
    setVisible(!visible);
  };

  const [formValues, setFormValue] = useState({
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const formRef = useRef();
  const model = Schema.Model({
    username: Schema.Types.StringType().isRequired('Bạn chưa nhập tên tài khoản.'),
    password: Schema.Types.StringType().isRequired('Bạn chưa nhập mật khẩu.')
  });

  const handleSubmit = async () => {
     if (!formRef.current.check()) {
       return;
    }

    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      username: formValues.username,
      password: formValues.password,
    }).catch((error) => {
      return null
    })

    setLoading(false);

    if(res.error){
      toaster.push(
        <Message type='error' showIcon>Tên tài khoản hoặc mật khẩu không đúng</Message>, 
        { placement : 'topStart'}
      )
    }
  }

 if (session) {
    return (
      <>
       <section className={styles.x_account_container}>
          <span className={styles.x_neumorphic}>
                <Image alt='layout' src={'/layout/decorations-01.svg'} width={800} height={800}/>
          </span>
          <Container className={styles.x_container}>
            <Component />
            <Row>
              <Col xs={24}>
                <div className={styles.x_login + ' ' + styles.x_logged_form}>
                  <h1 className={styles.x_account_title}>KANBOX GPT AI GREETING</h1>
                  <p className={styles.x_greeting}>
                      <TypeAnimation
                          sequence={[
                            'Cám ơn bạn đã đăng nhập vào hệ thống của chúng tôi, Kanbox GPT AI sử dụng trí tuệ nhân tạo của Open AI tạo cuộc trò chuyện tìm kiếm những thông tin một cách nhanh chóng và chính xác theo thời gian thực, chúng tôi đang trong quá trình nghiên cứu và hoàn thiện, nếu bạn gặp bất cứ khó khăn nào, hãy liên hệ với kanbox.vn để được hỗ trợ nhanh nhất',
                            () => { setShowButton(true); }
                          ]
                        }
                          wrapper="div"
                          cursor={true}
                          repeat={1}
                        />
                  </p>
                  { showButton && <Link href="/"><Button color="blue" appearance='ghost' block><IoHomeOutline/> Về Trang chủ</Button></Link> }
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </>
    )
  }

  return (
   <>
    <section className={styles.x_account_container}>
       <span className={styles.x_neumorphic}>
            <Image alt='layout' src={'/layout/decorations-01.svg'} width={800} height={800}/>
      </span>
      <Container className={styles.x_container}>
        <Row>
          <Col xs={24}>
            <div className={styles.x_login}>
              <h1  className={styles.x_account_title}>ĐĂNG NHẬP</h1>
              <Form 
                fluid
                onSubmit={handleSubmit}
                className={styles.x_login_form}
                model={model} 
                ref={formRef}
              >
                <Form.Group>
                  <Form.ControlLabel>Tên đăng nhập hoặc địa chỉ Email</Form.ControlLabel>
                  <Form.Control name='username' type='text' value={formValues.username} onChange={(e) => setFormValue({...formValues, username:e})} placeholder='Nhập tên tài khoản'></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>Mật khẩu</Form.ControlLabel>
                  <div className={styles.x_password_input_group}>
                    <Form.Control 
                          name='password' 
                          value={formValues.password} 
                          onChange={(e) => setFormValue({...formValues, password:e})} 
                          placeholder='Nhập mật khẩu'
                          type={visible ? 'text' : 'password'} 
                        />
                      <InputGroup.Button onClick={handleChange}>
                        {visible ? <IoEyeOutline /> : <IoEyeOffOutline />}
                      </InputGroup.Button>
                  </div>
                </Form.Group>
                <Form.Group>
                  <small className={styles.x_account_navigate}>Bạn chưa có tài khoản? xin vui lòng <Link href="/dang-ky">đăng ký</Link></small>
                </Form.Group>
                <Form.Group>
                  <Button className={styles.x_login_button} appearance="primary" type='submit'>
                    {
                      loading ? <span className={styles.x_loading_icon}><Loader /> </span>: ''
                    }
                    Đăng nhập</Button>
                </Form.Group>
              </Form>
              <SocialButton />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
   </>
  )
}

export default Login