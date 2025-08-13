import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();

console.log("--- Initializing Mail Transporter ---");
console.log("process.env.EMAIL:", process.env.EMAIL);

const transporter= nodemailer.createTransport({
    host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
})
export {transporter}