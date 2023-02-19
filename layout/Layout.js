import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Loading from './Loading';
import { useOneTapSignin } from '../components/useOneTapSignin';
import { useSession } from "next-auth/react"
import Script from 'next/script'

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

  const { status } = useSession();
  const { data: session } = useSession();
  const isSignedIn = status === 'authenticated';
  const { parentContainerId } =  {};
  const [isLoading, setIsLoading] = useState(false);

  const Component = () => {
    const { isLoading } = useOneTapSignin({
      redirect: false,
      parentContainerId: 'googleAuthenticator',
    });
    return (
      <div id="googleAuthenticator" style={{ position: 'fixed', top: '100px', right: '10px', zIndex: 999 }} />
    );
  };

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      const { google } = window;
      if (google) {
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_ID,
          callback: async (response) => {
            setIsLoading(true);

            // Here we call our Provider with the token provided by google
            await signIn('googleonetap', {
              credential: response.credential,
              redirect: true,
              ...opt,
            });
            setIsLoading(false);
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
  }, [isLoading, isSignedIn, parentContainerId]);

  return (
    <>
      {
        loading ? 
          <Loading /> : 
          <> 
            <Component />
            { children } 
          </>
      }

       <Script id="gsi" src="https://accounts.google.com/gsi/client" strategy="afterInteractive"/>
    </>
  )
}

export default Layout