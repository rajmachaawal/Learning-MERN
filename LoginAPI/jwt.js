import { SignJWT, jwtVerify } from "jose";

async function createAccessToken(userId, secret, alg) {
    const userJWT = await new SignJWT({
        sub: userId
    })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime("0s")
        .sign(secret);

    return userJWT;
}

async function verifyAccessToken(token, secret, [alg]) {
    const { payload, protectedHeader } = await jwtVerify(
        token,
        secret,
        { algorithms: [alg] }
    );

    return payload.sub;
}


export {createAccessToken,verifyAccessToken}