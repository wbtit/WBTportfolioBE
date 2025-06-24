import bcrypt from 'bcrypt'

 const hashPassword=async(password)=>{
    const saltRounds=10;
    const hashPassword= await bcrypt.hash(password,saltRounds);
    return hashPassword;
}

const comaprePassword= async(password,hashPassword)=>{
    const isMatch= bcrypt.compare(password,hashPassword)
    return isMatch;
}
export {hashPassword,comaprePassword}