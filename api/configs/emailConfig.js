import { Resend } from "resend";


export const emailConnect = async () => {

const resend =  new Resend(process.env.SMTP_PASSWORD)
  return resend
};

