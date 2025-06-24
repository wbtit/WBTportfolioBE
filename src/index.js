import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'


dotenv.config()
const app = new express

app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"WELCOME TO WHITEBOARDTEC...!"
    })
})
const PORT= process.env.PORT || 3000
    app.listen(PORT,()=>{
        console.log(`Server is running....http://localhost:${PORT}`)
    })