import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useOneTapSignin } from '../components/useOneTapSignin';
import { useSession } from "next-auth/react";

import Head from 'next/head';
import NextNProgress from 'nextjs-progressbar';
import Script from 'next/script'

const Layout = ({ children }) => {

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() =>{
    router.events.on('routeChangeStart', () => {
      setLoading(true)
    })
    router.events.on('routeChangeComplete', () => {
      setLoading(false)
    })
  }, [])

  const { status } = useSession();
  const { data: session } = useSession();
  const isSignedIn = status === 'authenticated';
  const { parentContainerId } =  {};

  const Component = () => {
    const { loading } = useOneTapSignin({
      redirect: false,
      parentContainerId: 'googleAuthenticator',
    });
    return (
      <div id="googleAuthenticator" style={{ position: 'fixed', top: '100px', right: '10px', zIndex: 999 }} />
    );
  };

  useEffect(() => {
    if (!loading && !isSignedIn) {
      const { google } = window;
      if (google) {
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_ID,
          callback: async (response) => {
            setLoading(true);
            // Here we call our Provider with the token provided by google
            await signIn('googleonetap', {
              credential: response.credential,
              redirect: true,
              ...opt,
            });
            setLoading(false);
          },
          prompt_parent_id: parentContainerId,
          style:
            'position: absolute; top: 100px; right: 30px;width: 0; height: 0; z-index: 1001;',
        });

        // Here we just console.log some error situations and reason why the google one tap
        // is not displayed. You may want to handle it depending on yuor application
        google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            console.log(notification.getNotDisplayedReason());
          } else if (notification.isSkippedMoment()) {
            console.log(notification.getSkippedReason());
          } else if (notification.isDismissedMoment()) {
            console.log(notification.getDismissedReason());
          }
        });
      }
    }
  }, [loading, isSignedIn, parentContainerId]);

  return (
    <>   
      <Head>
        <title>Kanbot AI chat app</title>
        <meta name="description" content="Chúng tôi cung cấp các sản phẩm mẫu hỗ trợ các nội dung số để bạn có thể đưa thông tin doanh nghiệp và sản phẩm của mình lên mạng Internet một cách nhanh chóng và dễ dàng. Điều này giúp bạn gia tăng hiệu quả hoạt động với chi phí thấp nhất"/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://kanbox.vn/" />
        <meta property="og:locale" content="vi_VN"/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="Kan solution - Thiết kế website chuyên nghiệp giá rẻ nhất"/>
        <meta property="og:description" content="Chúng tôi cung cấp các sản phẩm mẫu hỗ trợ các nội dung số để bạn có thể đưa thông tin doanh nghiệp và sản phẩm của mình lên mạng Internet một cách nhanh chóng và dễ dàng. Điều này giúp bạn gia tăng hiệu quả hoạt động với chi phí thấp nhất" />
        <meta property="og:url" content="https://kanbox.vn/"/>
        <meta property="og:site_name" content="Kan Solutions"/>
        <meta property="og:image" content="https://kanbox.vn/wp-content/uploads/2022/03/Content-marketing.jpg"/>
        <meta property="og:image:width" content="2000"/>
        <meta property="og:image:height" content="1000"/>
        <meta property="og:image:type" content="image/jpeg"/>
      </Head>
      <main className="site-main">
        <NextNProgress color="#0468fe" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={false} />
        <Component />
        { children } 
      </main>
      <Script id="gsi" src="https://accounts.google.com/gsi/client" strategy="afterInteractive"/>
    </>
  )
}

export default Layout