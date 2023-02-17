// This is an example of how to read a JSON Web Token from an API route
import { getToken } from "next-auth/jwt"
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET

const JwtMiddleWare = (req, res, next ) => {
  /* Check existed token header */
  const tokenHeader = req.headers.authorization;
  if(!tokenHeader) next();
  /* Check existed bearer token */
  const BearerToken = tokenHeader.split(" ")[1];
  if(!BearerToken) next();
  /* Add session if validated bearer token */
  const session = jwt.verify( BearerToken, secret, function(err, decoded) {
    return decoded;
  } );
  if(session){
    req.session = session;
  }
  next();
}

export default JwtMiddleWare