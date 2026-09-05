import { SignJWT } from "jose";

//FUNCTION THAT ISSUES A JWT:
async function createAccessToken(userId){
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const alg = 'HS256';

    const userJWT  = await new SignJWT({sub:userId})
    .setProtectedHeader({alg})
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secret)

    return userJWT;
};

export {createAccessToken};