import { SessionProvider } from "next-auth/react"
import Layout from '../layout/Layout';
import 'rsuite/dist/rsuite.min.css';
import '../styles/globals.css'

function App({ Component,  pageProps: { session, ...pageProps }  }) {
  return (
    <SessionProvider 
      session={session}
      refetchInterval={5 * 60}
        // Re-fetches session when window is focused
      refetchOnWindowFocus={true}>
         <Layout>
            <Component {...pageProps} />
          </Layout>
    </SessionProvider>
  )
}

export default App
