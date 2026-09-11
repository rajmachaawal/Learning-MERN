import { getJwtSecret, verifyAccessToken } from "../jwt.js";


async function authMiddleware(req, res, next) {
    try{
        //AUTHORIZATION EXTRACTION:
        const authorization = req.headers.authorization;

        //AUTHORIZATION VALIDATION:
        if(!authorization){
            return res.status(401).json({
                message: "Invalid or missing authentication credentials",
                status: "Unauthorized"
            });
        }

        //TOKEN SEPARATION:
        const authParts = authorization.split(' ');
        if(authParts.length !== 2 || authParts[0] !== "Bearer" || !authParts[1]){
            return res.status(401).json({
                message: "Invalid or missing authentication credentials",
                status: "Unauthorized"
            });
        }
        const token = authParts[1];

        //TOKEN VERIFICATION:
        const {payload, protectedHeader} = await verifyAccessToken(token, getJwtSecret())
        //ATTACHING AUTHENTICATOIN INFORMATION TO USER:
        req.user = payload.sub;
        
        next();

    }catch(error){
        console.error("Authentication error:",error.message);

        return res.status(401).json({
            message: "Invalid or missing authentication credentials",
            status: "Unauthorized"
        });
    }

}

export { authMiddleware };