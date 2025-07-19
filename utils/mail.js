import nodemailer from 'nodemailer';
import { SMTP_PASS, SMTP_USER } from '../config/env.js';



// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// otp mail
export const sendOtpEmail = async (email, otp, passwordResetLink) => {
  try {
    const info = await transporter.sendMail({
      from: SMTP_USER,
      to: email,
      subject: "🔒 OTP for Verification",
      text: `Hello, Your OTP for verification is: ${otp}. Please use this code to complete your verification process. If you did not request this OTP, please ignore this email or contact support.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #222; background: #f9f9f9; padding: 24px; border-radius: 8px; line-height: 1.6;">
          <h2 style="color: #2d7ff9;">🔒 OTP Verification</h2>
          <p style="font-size: 16px;">👋 Hello,</p>
          <p style="font-size: 16px;">Your OTP for verification is:</p>
          <p style="font-size: 24px; font-weight: bold; color: #2d7ff9;">${otp}</p>
          <p style="font-size: 14px; color: #888; margin-top: 24px;">⚠ Please use this code to complete your verification process. If you did not request this OTP, please ignore this email or contact our support team.</p>
        </div>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error while sending mail", error);
  }
};

// send the mail
export const sendUserDetails = async (email, role, password) => {
  try {
    const info = await transporter.sendMail({
      from: SMTP_USER, // sender address
      to: email, // list of receivers
      subject: "🎉 User Account Created Successfully!",

      text: `Hello,

Your user account with the email ${email} has been successfully created.
You have registered as a ${role}.
Your login password is: ${password}

If you did not sign up for this account, please ignore this email or contact support.`,

      html: `<div style="font-family: Arial, sans-serif; color: #222; background: #f9f9f9; padding: 24px; border-radius: 8px; line-height: 1.6;">
  <h2 style="color: #2d7ff9;">✅ Your Account Has Been Created</h2>

  <p style="font-size: 16px;">
    👋 Hello,
  </p>

  <p style="font-size: 16px;">
    Your account associated with the email 
    <b style="color: #2d7ff9;">${email}</b> has been successfully created.
  </p>

  <p style="font-size: 16px;">
    🛡️ You registered as: 
    <b style="color: #2d7ff9;">${role}</b>
  </p>

  <p style="font-size: 16px;">
    🔐 Your password: 
    <code style="background: #eaeaea; padding: 4px 8px; border-radius: 4px; font-family: monospace; color: #d63384;">${password}</code>
  </p>

  <p style="font-size: 14px; color: #888; margin-top: 24px;">
    ⚠️ If you did not sign up for this account, please ignore this email or contact our support team.
  </p>
</div>`
      ,
    });
    // log the mesage id in the console
    console.log("Message sent: %s", info.messageId);

    // preview the generated URL for the email
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error while sending mail", error);
  }
}

export const sendDeliveryEmail = async (email) => {
  try {
    const info = await transporter.sendMail({
      from: SMTP_USER, // sender address
      to: email, // list of receivers
      subject: "📦 Your Package is Out for Delivery!",
      text: `Hello,

Your package is out for delivery! 📬
Please meet the delivery person at your respective post to receive it.

Thank you for shopping with us!`,
      html:  `
<div style="font-family: 'Segoe UI', sans-serif; background: #f0f8ff; padding: 30px; border-radius: 10px; max-width: 600px; margin: auto; box-shadow: 0 2px 12px rgba(0,0,0,0.1);">
  <div style="text-align: center;">
    <img src="https://cdn-icons-png.flaticon.com/512/891/891462.png" alt="Delivery Logo" width="80" style="margin-bottom: 20px;" />
    <h2 style="color: #2e86de;">📦 Your Package is Out for Delivery!</h2>
  </div>

  <p style="font-size: 16px; color: #333;">
    Hello, 
  </p>

  <p style="font-size: 16px; color: #333;">
    We’re excited to let you know that your package is on the way! 🚚
  </p>

  <p style="font-size: 16px; color: #333;">
    Please meet the delivery person at your respective post to collect it.
  </p>

  <p style="font-size: 16px; color: #333;">
    Thank you for shopping with us!
  </p>

  <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

  <p style="font-size: 13px; color: #888; text-align: center;">
    📫 If you have questions, feel free to contact our support team.
  </p>
</div>
`,

    });
    // log the mesage id in the console
    console.log("Message sent: %s", info.messageId);

    // preview the generated URL for the email
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error while sending mail", error);
  }
}

export const sendForgetPasswordOTP = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: SMTP_USER,
      to: email,
      subject: 'Password Reset Link',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
              background-color: #ffffff;
              border: 1px solid #dddddd;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              background-color: #007bff;
              color: #ffffff;
              padding: 10px;
              border-bottom: 1px solid #dddddd;
            }
            .header h2 {
              margin: 0;
            }
            .content {
              padding: 20px;
            }
            .button {
              background-color: #007bff;
              color: #ffffff;
              padding: 10px 20px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              text-decoration: none;
            }
            .button:hover {
              background-color: #0056b3;
            }
            .footer {
              padding: 10px;
              border-top: 1px solid #dddddd;
              font-size: 12px;
              color: #666666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Password Reset Request</h2>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password. If you didn't request this, please ignore this email.</p>
              <p>To reset your password, Enter the OTP below:</p>
              <p>${otp}</p>
              <p>Best regards,</p>
              <p>Your App Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Your App. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error while sending mail", error);
  }
};

