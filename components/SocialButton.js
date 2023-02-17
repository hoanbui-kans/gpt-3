import { signIn } from 'next-auth/react'
import { Button } from 'rsuite'
import { IoLogoFacebook, IoLogoGoogle } from "react-icons/io5";
import styles from '../styles/account.module.css'

const SocialButton = () => {
  return (
    <>
    <p className={styles.x_social_title}>Đăng nhập bằng mạng xã hội</p>
      <div className={styles.x_social_login}>
        <Button className={styles.x_facebook_login} onClick={() => signIn("facebook")}>
          <IoLogoFacebook size={24}/>
        </Button>
        <Button className={styles.x_google_login} onClick={() => signIn("google")}>
          <IoLogoGoogle size={24}/>
        </Button>
      </div>
    </>
  )
}

export default SocialButton