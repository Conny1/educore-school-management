export const resetPasswordEmail = ({ user_name, reset_link }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f6fa;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background: #ffffff;
      margin: auto;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .title {
      font-size: 22px;
      font-weight: bold;
      color: #333333;
      margin-bottom: 20px;
    }
    .message {
      font-size: 16px;
      color: #555555;
      margin-bottom: 25px;
    }
    .button {
      display: inline-block;
      background-color: #52d9a7;
      color: #ffffff;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
    .button:hover {
      background-color: #3cb78b;
    }
    .footer {
      font-size: 12px;
      color: #888888;
      margin-top: 30px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="title">Reset Your Password</div>
    <div class="message">
      Hello ${user_name},<br><br>
      We received a request to reset your password. Click the button below to set a new password:
    </div>
    <a href="${reset_link}" class="button">Reset Password</a>
    <div class="message" style="margin-top: 25px;">
      If you didn’t request this, you can safely ignore this email.
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Educore. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const otpEmailTemplate = ({ user_name, otp_code }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Your OTP Code</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f6fa;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background: #ffffff;
      margin: auto;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .title {
      font-size: 22px;
      font-weight: bold;
      color: #333333;
      margin-bottom: 20px;
    }
    .message {
      font-size: 16px;
      color: #555555;
      margin-bottom: 25px;
    }
    .otp-box {
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #ffffff;
      background-color: #52d9a7;
      padding: 16px 24px;
      border-radius: 8px;
      text-align: center;
      display: inline-block;
    }
    .footer {
      font-size: 12px;
      color: #888888;
      margin-top: 30px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="title">Your OTP Code</div>
    <div class="message">
      Hello ${user_name},<br><br>
      Use the following One-Time Password (OTP) to continue with your login or verification process.
    </div>
    <div class="otp-box">${otp_code}</div>
    <div class="message" style="margin-top: 25px;">
      This OTP is valid for a limited time. Do not share it with anyone.
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Educore. All rights reserved.
    </div>
  </div>
</body>
</html>
`;


