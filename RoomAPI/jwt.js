import { SignJWT, jwtVerify } from "jose";
const alg = "HS256";

function getJwtSecret() {
    return new TextEncoder().encode(process.env.JWT_SECRET);
}


async function createAccessToken(userId, secret, alg) {
    const userJWT = await new SignJWT({
        sub: userId
    })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime("12h")
        .sign(secret);

    return userJWT;
}

async function verifyAccessToken(token, secret) {
    const { payload, protectedHeader } = await jwtVerify(
        token,
        secret,
        { algorithms: ["HS256"] }
    );

    return {payload, protectedHeader};
}


export {createAccessToken,verifyAccessToken, getJwtSecret, alg}