import prisma from "../../db/prismaClient.js";
import { sendEmail } from "../../services/index.js";

const addCustomerData=async(req,res)=>{
    const {name,email,phone,message}=req.body
    //console.log(name,email,phone,message)
    if(!email||!name||!phone||!message){
        return res.status(400).json({
            message:"Fields are empty",
            data:null
        })
    }
    const customer= await prisma.customerData.create({
        data:{
            name,
            email,
            phone,
            message
        }
    })

        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New Website Inquiry - Whiteboard Technologies</title>
<style>
  body {
    font-family: Arial, Helvetica, sans-serif;
    background-color: #f4f6f8;
    color: #333333;
    margin: 0;
    padding: 0;
  }

  .email-wrapper {
    max-width: 650px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e0e0e0;
  }

  .email-header {
    background-color: #6adb45;
    padding: 20px;
    text-align: center;
  }

  .email-header img {
    max-width: 120px;
    margin-bottom: 10px;
  }

  .email-header h1 {
    margin: 0;
    color: #ffffff;
    font-size: 22px;
    font-weight: bold;
  }

  .email-body {
    padding: 25px 30px;
    line-height: 1.6;
  }

  .email-body h2 {
    font-size: 18px;
    color: #333333;
    margin-bottom: 10px;
  }

  .info-table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 15px;
  }

  .info-table th, .info-table td {
    text-align: left;
    padding: 10px;
    border: 1px solid #dddddd;
    font-size: 14px;
  }

  .info-table th {
    background-color: #f4f4f4;
    color: #555555;
    width: 30%;
  }

  .footer {
    text-align: center;
    padding: 20px;
    font-size: 12px;
    color: #777777;
    background-color: #f9f9f9;
  }

  .footer img {
    max-width: 120px;
    margin-top: 10px;
  }
</style>
</head>
<body>
  <div class="email-wrapper">
    <!-- Header -->
    <div class="email-header">
      <img src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9" alt="Whiteboard Technologies Logo" />
      <h1>New Website Inquiry</h1>
    </div>

    <!-- Body -->
    <div class="email-body">
      <h2>Hello Team,</h2>
      <p>You have received a new inquiry from your website contact form. Please review the details below:</p>

      <table class="info-table">
        <tr>
          <th>Name</th>
          <td>${customer.name}</td>
        </tr>
        <tr>
          <th>Email</th>
          <td>${customer.email}</td>
        </tr>
        <tr>
          <th>Phone</th>
          <td>${customer.phone || "N/A"}</td>
        </tr>
        <tr>
          <th>Message</th>
          <td>${customer.message}</td>
        </tr>
      </table>

      <p style="margin-top: 20px; font-size: 13px; color: #777;">
        This email was automatically generated from your website contact form.  
        Please respond to the customer at your earliest convenience.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Whiteboard Technologies Pvt. Ltd.</strong></p>
      <p>Bangalore, India</p>
      <img src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9" alt="Whiteboard Technologies Logo" />
    </div>
  </div>
</body>
</html>
`

    sendEmail({
      html: htmlContent,
      to:process.env.RECIPIENTMAIL,
      subject: "New enquiry from the website",
      text: "New enquiry from the website",
    });


        return res.status(200).json({
            message:"Data recorded successfully",
            data:customer
        })
    
}

const getAllCustomerData= async(req,res)=>{
    const userData= await prisma.customerData.findMany(
    )
    if(userData.length===0){
        return res.status(200).json({
            message:"No users Data in the DB",
            data:userData
        })
    }
    return res.status(200).json({
        message:"UserData fetched successfully",
        data:userData
    })
}
export{addCustomerData,getAllCustomerData}