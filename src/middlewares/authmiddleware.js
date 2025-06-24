import jwt from 'jsonwebtoken'

export const Authenticate=async(req,res,next)=>{
    try {
            const authHeader=req.body.headers.Authorization || req.body.headers.Authorization
            if(authHeader){
                try {
                    const token= authHeader.split(" ")[1]
                    const payload= jwt.verify(token,process.env.SECRET)
                    req.user=payload
                next()
                } catch (error) {
                    console.log(error.message)
                    return res.status(401).json({
                    message:"Invalid Token",
                    success:false,
                    data:null
                })
            }
    }else{
        return res.status(401).json({
            message:"Token not provided",
            success:false,
            data:null
        })
    }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message:error.message,
            success:false,
            data:null
        })
    }

}