import { useEffect, useRef, useState } from 'react'
import { Container, Row, Col, Form, Button, Schema, Loader, Input , InputGroup, useToaster, Message, Toggle  } from 'rsuite'
import { IoHomeOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router';
import Link from 'next/link'
import styles from '../styles/account.module.css';
import SocialButton from '../components/SocialButton';
import Image from 'next/image';
import axios from 'axios';
import Head from 'next/head';

const Register = () => {

  const router = useRouter();
  const { StringType } = Schema.Types;

  const rootURL = process.env.NEXT_PUBLIC_SITE_URL;

  const toaster = useToaster();

  const [visible, setVisible] = useState(false);
  const handleChange = () => {
    setVisible(!visible);
  };

  const { data: session } = useSession();

  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    password: '',
    repassword: '',
    autologin: false,
  }) 
  
  const model = Schema.Model({
    username: StringType().isRequired('Bạn chưa nhập tên tài khoản.'),
    email: StringType().isEmail('Email nhập vào chưa chính xác.'),
    password: StringType().isRequired('Bạn chưa nhập mật khẩu.'),
    repassword: StringType().addRule((value, data) =>{
      if (value !== data.password) {
        return false;
      }
      return true;
    }, 'Nhập lại mật khẩu không đúng').isRequired('Bạn chưa nhập lại mật khẩu.'),
  });

  const handleAutologin = (checked) => {
    if(checked){
      toaster.push(
          <Message showIcon type="info">
            Đăng nhập tự động sau khi đăng ký thành công.
          </Message>, 
        { placement: 'topStart' } 
      ) 
    } else {
      toaster.push(
          <Message showIcon type="info">
            Chuyển hướng đến đăng nhập sau khi đăng ký thành công.
          </Message>, 
        { placement: 'topStart' } 
      )
    }
    setFormValues({...formValues, autologin: checked})
  }
  
  const handleSubmit = async () => {
    // Check validate form data
     if (!formRef.current.check()) {
       toaster.push(
          <Message showIcon type="error">
            Một hoặc nhiều trường nhập vào không hợp lệ, xin vui lòng thử lại.
          </Message>, 
        { placement: 'topStart' }
      ) 
      return;
    }
    // Đăng ký tài khoản
    setLoading(true);

    let data = new FormData();
    data.append('email', formValues.email);
    data.append('username', formValues.username);
    data.append('password', formValues.password);
    data.append('repassword', formValues.repassword);

      var config = {
        method: 'post',
        url: rootURL + '/api/user/register',
        data : data,
        headers: { 
          'Content-Type': 'application/json'
        },
      };

      console.log(rootURL + 'api/user/register');

      const Register = await axios(config).then((res) => {
          return res.data;
      }).catch(function (error) {
        console.log(error);
      });

      setLoading(false);

      if(Register && !Register.error){
        // Đăng nhập tự động
        if(formValues.autologin){
          toaster.push(
              <Message showIcon type="success">
                Đăng ký thành công, khởi tạo đăng nhập.
              </Message>, 
            { placement: 'topStart' }
          )
          const loginUser = await signIn('credentials', {
            redirect: false,
            username: Register.data.username,
            password: Register.data.password,
            callbackUrl: `${window.location.origin}`,
          })
        } else {
          toaster.push(
              <Message showIcon type="success">
                  Đăng ký thành công, đang chuyển hướng đến đăng nhập.
              </Message>, 
            { placement: 'topStart' }
          )
          router.push('/dang-nhap/')
        }
      } else {
        toaster.push(
            <Message showIcon type="error">
              {Register ? Register.message : 'Đã có lỗi không mong muốn xảy ra, xui vui lòng liên hệ kỹ thuật để hỗ trợ!'}
            </Message>, 
          { placement: 'topStart' }
        )
      }
    }

    if (session) {
      const userName = session.user.username;
      const userEmail = session.user.email;
      return (
        <>
        <Head>
          
        </Head>
         <section className={styles.x_account_container}>
            <span className={styles.x_neumorphic}>
                <Image alt='layout' src={'/layout/decorations-01.svg'} width={800} height={800}/>
            </span>
            <Container className={styles.x_container}>
              <Row>
                <Col xs={24}>
                  <div className={styles.x_login + ' ' + styles.x_logged_form}>
                    <h1 className={styles.x_account_title}>Xin chào <span style={{color: '#398af3'}}>{userName}</span></h1>
                    <small>({userEmail})</small>
                    <p className={styles.x_greeting}>
                      <small>
                        Bạn đã đăng nhập vào hệ thống của chúng tôi, hãy bắt đầu sử dụng dịch vụ.
                      </small>
                      <Link href="/"><small>Về trang chủ</small></Link>
                    </p>
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
              <h1 className={styles.x_account_title}>Đăng ký tài khoản</h1>
              <Form 
                fluid
                className={styles.x_login_form}
                formValue={formValues}
                onChange={setFormValues}
                onSubmit={handleSubmit}
                model={model} 
                ref={formRef}
              >
                <Form.Group>
                  <Form.ControlLabel>Địa chỉ Email</Form.ControlLabel>
                  <Form.Control name='email' type='email' value={EventTarget.value} placeholder='Nhập địa chỉ Email'></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>Tên đăng nhập</Form.ControlLabel>
                  <Form.Control name='username' type='text' value={EventTarget.value} placeholder='Nhập tên tài khoản'></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>Mật khẩu</Form.ControlLabel>
                  <div className={styles.x_password_input_group}>
                    <Form.Control 
                          name='password' 
                          value={EventTarget.value} 
                          placeholder='Nhập mật khẩu'
                          type={visible ? 'text' : 'password'} 
                        />
                      <InputGroup.Button onClick={handleChange}>
                        {visible ? <IoEyeOutline /> : <IoEyeOffOutline />}
                      </InputGroup.Button>
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>Nhập lại mật khẩu</Form.ControlLabel>
                  <Form.Control 
                      name='repassword' 
                      type={visible ? 'text' : 'password'}  
                      value={EventTarget.value} 
                      placeholder='Nhập lại mật khẩu'>
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                <div className={styles.x_toggle_button}>
                    <Toggle 
                      size="sm" 
                      defaultChecked={formValues.autologin} 
                      onChange={(checked) => { handleAutologin(checked) }}
                    /> 
                    <span> Đăng nhập tự động sau khi đăng ký thành công</span>
                  </div>
                  <small className={styles.x_account_navigate}>Bạn đã có tài khoản? xin vui lòng <Link href="/dang-nhap">đăng nhập</Link></small>
                </Form.Group>
                <Form.Group>
                  <Button className={styles.x_login_button} appearance="primary" type="submit">
                    {
                      loading ? <span className={styles.x_loading_icon}><Loader /> </span>: ''
                    }
                    Đăng ký tài khoản</Button>
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

export default Register