import bcrypt from 'bcrypt'

export const hashPassword=async(password)=>{
    const saltRounds=10;
    const hashPassword= await bcrypt.hash(password,saltRounds);
    return hashPassword;
}

export const comaprePassword= async(password,hashPassword)=>{
    const isMatch= bcrypt.compare(password,hashPassword)
    return isMatch;
}