import jwt from 'jsonwebtoken'

export const generateToken=(payload)=>{
    const SECRET= process.env.SECRET
    const options={expiresIn:"10h"}

    const token= jwt.sign(payload,SECRET,options)
    return token
}