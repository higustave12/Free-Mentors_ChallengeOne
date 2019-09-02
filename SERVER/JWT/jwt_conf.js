import jwt from 'jsonwebtoken';

export const verifyToken=(req,res,next)=>{
    const token=req.header('x-auth-token');
    if(!token) return res.status(403).json({
        status:403,
        error:'Access denied. Token is required'
    });
   
    const user_verfication= jwt.verify(token,process.env.SECRET);
    req.user_token= user_verfication;
    next();
}