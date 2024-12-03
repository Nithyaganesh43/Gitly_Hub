const nodemailer = require('nodemailer');
const otpLimiter = require("../helper/otpLimiter");
require('dotenv').config();
async function sendMail( otp,toEmail) {

 await otpLimiter( toEmail); 
  
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'www.gitly@gmail.com',
            pass: process.env.PASSWORD
        }
    });

    const subject = 'Your OTP Code';

    const htmlContent = `<html>
    <head>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                color: #333;
            }

            @media (prefers-color-scheme: dark) {
                body {
                    background-color: #121212;
                    color: #ddd;
                }
                .container {
                    background-color: rgba(40, 40, 40, 0.9);
                    box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
                }
                h1 {
                    color: #fff;
                }
                .otp {
                    border: 2px solid #76ff03;
                    color: #76ff03;
                    background-color: #1b5e20;
                }
                .note {
                    color: #bbb;
                }
            }

            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: rgba(255, 255, 255, 0.9);
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                text-align: center;
                position: relative;
                z-index: 1;
            }

            h1 {
                font-size: 24px;
                margin-bottom: 10px;
            }

            .otp {
                font-size: 24px;
                font-weight: bold;
                padding: 10px;
                border: 2px solid #4CAF50;
                color: #4CAF50;
                display: inline-block;
                margin: 20px 0;
                background-color: #e8f5e9;
            }

            .logo {
                width: 150px;
                height: 150px;
                margin: 20px 0;
                border-radius: 50%;
                object-fit: cover;
                border: 5px solid #4CAF50;
            }

            .note {
                margin-top: 10px;
                font-size: 14px;
                color: #555;
            }

            .background-gif {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 0;
                opacity: 0.5;
                pointer-events: none;
                background: url('https://res.cloudinary.com/dmini3yl9/image/upload/v1730611262/pjdfokhn7bhvebovsf8u.png') center/cover no-repeat;
            }

            @media (max-width: 480px) {
                h1 {
                    font-size: 20px;
                }
                .otp {
                    font-size: 20px;
                    padding: 8px;
                }
                .note {
                    font-size: 12px;
                }
                .logo {
                    width: 100px;
                    height: 100px;
                }
            }
        </style>
    </head>
    <body>
        <div class="background-gif"></div>
        <div class="container">
            <img src="https://res.cloudinary.com/dmini3yl9/image/upload/v1730611262/pjdfokhn7bhvebovsf8u.png" class="logo" alt="Gitly Logo" />
            <h1>Your OTP Code</h1>
            <div class="otp">${otp}</div>
            <p class="note">Please copy the OTP above and use it for verification.</p>
        </div>
    </body>
</html>

    `;

    const info = await transporter.sendMail({
        from: 'gitly',
        to: toEmail,
        subject: subject,
        html: htmlContent
    });  
}
 

module.exports = sendMail;

 
