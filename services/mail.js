import nodemailer from "nodemailer";
import "dotenv/config";

const mailName = process.env.MAILTRAP_NAME;
const mailPassword = process.env.MAILTRAP_PASSWORD;

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: mailName,
    pass: mailPassword,
  },
});

function sendMail(message) {
  return transport.sendMail(message);
}

export default { sendMail };
