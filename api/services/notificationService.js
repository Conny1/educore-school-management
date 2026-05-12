import { emailConnect } from "../configs/emailConfig.js";
import { otpEmailTemplate, resetPasswordEmail } from "../configs/emailTemplate.js";
import Notifications from "../models/Notifications.js";

// Add New Notification Settings
export const createNotification = async (body) => {
  let payload = {
    schoolId: body.schoolId,
    title: body.title,
    type: body.type,
    description: body.description,
    data: body.data,
  };

  if (body?.user_id) {
    payload[body?.user_id] = body.user_id;
  }

  try {
    const notificationRsp = new Notifications(payload);
    return await notificationRsp.save();
  } catch (error) {
    throw new Error(error);
  }
};

const sendEmail = async (payload, template) => {
  try {
    const transporter = await emailConnect(); // ✅ Await the transporter

    let info = await transporter.emails.send({
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      html: template,
    });

    console.log("Email sent successfully!");
    // console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(error);
  }
};

export const resetPasswordlink = async (to, body) => {
  return await Promise.all([
    createNotification({
      schoolId: body.schoolId,
      title: "reset password link",
      type: "email",
      description: "Link has been sent to your email to reset your password.",
      data: body,
      user_id: body.user_id,
    }),
    sendEmail(
      {
        from: `Educore <${process.env.SMTP_EMAIL_ID}>`,
        to: to,
        subject: "Reset Password Notification",
      },
      resetPasswordEmail(body),
    ),
  ]);
};

export const sendOTPemail = async (to, body) => {
  return await Promise.all([
    createNotification({
      workspace_id: body.workspace_id,
      title: "OTP verification",
      type: "email",
      description: "OTP has been sent for verification",
      data: body,
      user_id: body.user_id,
    }),
    sendEmail(
      {
        from: `"Educore"<${process.env.SMTP_EMAIL_ID}>`,
        to: to,
        subject: "OTP Verification code",
      },
      otpEmailTemplate(body),
    ),
  ]);
};
