import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // create transporter and select email provider
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // add email information
  const info = {
    from: `"NodeShop" ${process.env.EMAIL_USER}`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(info);
};

export default sendEmail;
