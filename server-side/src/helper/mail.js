const nodemailer = require('nodemailer');
const otpLimiter = require("../helper/otpLimiter");
require('dotenv').config();

async function sendMail(otp, toEmail) {
    await otpLimiter(toEmail);

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
                background-color: #87CEEB;
                color: #333;
                background-image: url('https://images.pexels.com/photos/40465/pexels-photo-40465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
                background-size: cover;
                background-position: center;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
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
                padding: 20px;
                background-color: rgba(255, 255, 255, 0.9);
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                text-align: center;
                z-index: 1;
            }

            h1 {
                font-size: 24px;
                margin-bottom: 10px;
                color: #333;
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

            .logo1 {
                width: 35px;
                height: 35px;
                transition: all 0.3s ease-in-out;
            }

            .logo1:hover {
                transform: scale(1.2);
                filter: brightness(1.2) drop-shadow(0 0 5px rgba(167, 193, 214, 0.8));
            }

            .note {
                margin-top: 10px;
                font-size: 14px;
                color: #555;
            }

            footer {
                text-align: center;
                margin-top: 30px;
                position: absolute;
                bottom: 20px;
                width: 100%;
            }

            .footer p {
                font-size: 12px;
                color: #333;
                margin-bottom: 10px;
            }

            .social-icons {
                display: flex;
                justify-content: center;
                gap: 15px;
                flex-wrap: wrap;
                margin-top: 10px;
            }

            .social-icons a {
                display: inline-block;
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
                .logo1 {
                    width: 30px;
                    height: 30px;
                }
                footer p {
                    font-size: 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Your OTP Code </h1>
            <div class="otp">${otp}</div>
            <p class="note">Please copy the OTP above and use it for verification within 10 minutes.</p>
        </div> 
    </body>
</html>`;

    const info = await transporter.sendMail({
        from: 'Nithya Ganesh',
        to: toEmail,
        subject: subject,
        html: htmlContent
    });
}

module.exports = sendMail;
