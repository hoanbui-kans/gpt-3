import { useRef, useState } from 'react'
import { 
  Container, Row, Col, 
  Form,InputGroup, Button, 
  Schema, Loader, Toggle, Message, 
  useToaster 
} from 'rsuite'
import Link from 'next/link'
import styles from '../styles/account.module.css';
import { IoHomeOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useSession, signIn, signOut } from "next-auth/react"
import { useOneTapSignin } from '../components/useOneTapSignin';
import SocialButton from '../components/SocialButton';
import Image from 'next/image';
import Script from 'next/script';

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
  const { status } = useSession();
  const isSignedIn = status === 'authenticated';
  const { parentContainerId } =  {};
  const [isLoading, setIsLoading] = useState(false);
  
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
      // callbackUrl: '' // `${window.location.origin}`,
    }).catch((error) => {
      console.log(error)
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
    const userName = session.user.username;
    const userEmail = session.user.email;
    return (
      <>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
       <section className={styles.x_account_container}>
          <span className={styles.x_neumorphic}>
                <Image alt='layout' src={'/layout/decorations-01.svg'} width={800} height={800}/>
          </span>
          <Container className={styles.x_container}>
            <Component />
            <Row>
              <Col xs={24}>
                <div className={styles.x_login + ' ' + styles.x_logged_form}>
                  <Link href = '/'>
                      Trở về trang chủ
                  </Link>
                  <h1 className={styles.x_account_title}>Xin chào <span style={{color: '#398af3'}}>{userName}</span></h1>
                  <small>({userEmail})</small>
                  <p className={styles.x_greeting}>
                    <small>
                      Bạn đã đăng nhập vào hệ thống của chúng tôi, hãy bắt đầu tạo website của bạn, nếu bạn không phải <strong>{userName}</strong>, xin vui lòng <a href="#" onClick={() => signOut()}>Đăng xuất</a>
                    </small>
                  </p>
                  <Link href="/quan-ly">
                      Quản lý tài khoản
                  </Link>
                  <SocialButton />
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
              <Link href = '/'>
                Trở về trang chủ
              </Link>
              <h1  className={styles.x_account_title}>Đăng nhập</h1>
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
                  <div className={styles.x_toggle_button}>
                    <Toggle size="sm" /><span>Đăng nhập tự động</span>
                  </div>
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