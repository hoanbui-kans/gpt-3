import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { Breadcrumb } from 'rsuite';
import styles from '../styles/components.module.css';
import Link from 'next/link';
const HeaderNav = () => {
  return (
    <>
    <div className={styles.x_nav_bar}>
        <Breadcrumb className={'x_breadcumb'}>
          <Breadcrumb.Item as={Link} href="/">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item as={Link} href="/du-an/">Dự án</Breadcrumb.Item>
          <Breadcrumb.Item active>{'kanbox'}</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.x_nav_menu}>
            <a href="#" onClick={() => signOut()}>Đăng xuất</a>
        </div>
    </div>
    </>
  )
}

export default HeaderNav