import { verifyAccessToken } from "../jwt.js";
import {secret, alg} from '../Constants/constants.js'

async function authMiddleware(req, res, next) {
    const authorization = req.headers.authorization;


    //AUTHORIZATION DESTRUCTURING:
    const authorizationParts = authorization.split(' ');
    const token  =  authorizationParts[1];
    console.log(token);

    const verifiedUserId = await verifyAccessToken(token, secret, alg)
    console.log(verifiedUserId);
}

export { authMiddleware };