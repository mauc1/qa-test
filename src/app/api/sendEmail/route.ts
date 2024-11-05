import { handlerChangePassword, handlerEmailToUserId } from '@/controller/profesorController';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: any) {
    try {
        const { subject } = await request.json(); 
        
        const transporter = nodemailer.createTransport({
            service: 'zoho',
            host: 'smtp.zoho.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const newPassword = Math.random().toString(36).slice(-8);

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: subject,
            subject: 'Reset Password Team TEC',
            html:  `
            <h1>New Password</h1> 
            <p>This is an automatic email, associated to TeamTec staff</p>
            <p>Here is your new password: ${newPassword}</p>
            `
        };

        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
            console.log(error);
            } else {
            console.log("Server is ready to take our messages");
            }
        });
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
                //save pass in db
                handlerEmailToUserId(subject).then((data) => {
                    handlerChangePassword(data, newPassword);
                });
            }
        }
        );
        return NextResponse.json({ message: 'Email sent' }, { status: 200 });
        
    } catch (error) {
        console.log('error')
        console.log(error)
        //return NextResponse.json({ message: 'Email not sent' }, { status: 500 });
    }
}