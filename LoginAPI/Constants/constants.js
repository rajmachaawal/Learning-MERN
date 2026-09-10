const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const alg = 'HS256'
export {secret,alg};