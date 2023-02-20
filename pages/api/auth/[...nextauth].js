import NextAuth from "next-auth"
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import axios from "axios"
import CredentialsProvider from "next-auth/providers/credentials";
import HandlerSocialLogin from "../HandleSocialLogin";
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const rootURL = process.env.NEXT_PUBLIC_SITE_URL;

// This is an instance of a google client that we need to ask google informations about the user
const googleAuthClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_ID);

const options = {
  secret: process.env.SECRET,
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    // OAuth authentication providers
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Tài khoản", type: "text", placeholder: "Tên đăng nhập" },
        password: {  label: "Mật khẩu", type: "password" }
      },
      async authorize(credentials, req) {
        const config = {
          method: 'post',
          url: rootURL + '/api/user/login',
          data : {
            password: credentials.password,
            username: credentials.username
          },
          headers: { 
            'Content-Type': 'application/json'
          },
        };
        const ResponseUser = await axios(config)
          .then(function (response) {
              return response.data;
          })
          .catch(function (error) {
            console.log('Lỗi đăng nhập: ', 'error');
              return null
        });

        if (ResponseUser) {
          return ResponseUser
        } else {
          return null
        }
      }
    }),
    CredentialsProvider({
      // The id of this credential provider. It's important to give an id because, in frontend we don't want to
      // show anything about this provider in a normal login flow
      id: 'googleonetap',
      // A readable name
      name: 'google-one-tap',

      // This field define what parameter we expect from the FE and what's its name. In this case "credential"
      // This field will contain the token generated by google
      credentials: {
        credential: { type: 'text' },
      },
      // This where all the logic goes
      authorize: async (credentials) => {

        // The token given by google and provided from the frontend
        const token = credentials.credential;
 
        // We use the google library to exchange the token with some information about the user
        const ticket = await googleAuthClient.verifyIdToken({
          // The token received from the interface
          idToken: token,
          // This is the google ID of your application
          audience: process.env.NEXT_PUBLIC_GOOGLE_ID,
        });

        const payload = ticket.payload; // This is the user

        if (!payload) {
          throw new Error('Cannot extract payload from signin token');
        }
        
        const {
          email,
          sub,
          given_name,
          family_name,
          name,
          email_verified,
          picture,
        } = payload;

        let dataOnetap = {     
          profile_id : sub,
          user_email : email,
          fullname: name,
          first_name : given_name,
          last_name : family_name,
          picture : picture,
          provider : 'google',
        };
       
        try {
          const HanderLoginOneTap = new HandlerSocialLogin(dataOnetap);
          const responseUserOneTap = await HanderLoginOneTap.socialLogin();

          if(responseUserOneTap){
              return responseUserOneTap;
            } else {
              return false;
          }
        } catch (error) {
          console.error(error);
        }

      },
    }),
  ],
  callbacks: {
    async signIn({user, account, profile}) {
      const provider = account.provider;
      let socialData = '';
      switch(provider){
        case 'google':
          socialData = {     
            'profile_id' : profile.sub,
            'user_email' : user.user_email,
            'fullname': profile.name,
            'first_name' : profile.given_name,
            'last_name' : profile.family_name,
            'picture' : profile.picture,
            'provider' : provider,
          };

          try {

            const HanderLoginGoogle =  new HandlerSocialLogin(socialData);
            const responseUserGoogle = await HanderLoginGoogle.socialLogin();
  
            if(responseUserGoogle){
                user.token = { ...responseUserGoogle };
                return responseUserGoogle;
              } else {
                return false;
            }
          } catch (error) {
            return false;
          }
        break;
        case 'facebook':
            socialData = {     
              'profile_id' : profile.id,
              'user_email' : user.email,
              'fullname': profile.name,
              'first_name' : profile.given_name,
              'last_name' : profile.family_name,
              'picture' : profile.picture.data.url,
              'access_token': account.access_token,
              'provider' : provider,
           };

           try {
            const HanderLoginFB =  new HandlerSocialLogin(socialData);
            const responseUserFB = await HanderLoginFB.socialLogin();
            console.log(responseUserFB);
            if(responseUserFB){
                user.token = { ...responseUserFB };
                return user;
              } else {
                return false;
            }
           } catch (error) {
            return false;
           }
        break;
        default:  
        user.token = { ...user }
        return user
      }
    },

    async redirect({ account, token , url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/dang-nhap/")) {
        const baseUrl = `${baseUrl}${url}`;
        return baseUrl;
      } 
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    async jwt({ token, user }) {
      if (user){
        const JWTtoken = jwt.sign( user.token , process.env.SECRET, { algorithm: 'HS256'});
        token = { token: JWTtoken };
      }
      return token;
    },

    async session({session, token}){
      if(token){
        session.token = token.token;
      }
      return session
    }
  }
}

export default (req, res) => {
  return NextAuth(req, res, options)
}