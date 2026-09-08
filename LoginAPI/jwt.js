import { jwtVerify, SignJWT } from "jose";




//FUNCTION THAT ISSUES A JWT:
async function createAccessToken(userId,secret){
    const userJWT  = await new SignJWT({sub:userId})
    .setProtectedHeader({alg : ['HS256']})
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secret)

    return userJWT;
};

//FUNCTION THAT VERIFIES A RECIEVED JWT:
async function verifyAccessToken(token,secret){
    const {payload,protectedHeader} = await jwtVerify(token,secret,{alg:['HS256']});
    return payload.sub;
}

export {createAccessToken, verifyAccessToken};