import nodemailer from "nodemailer";
import logger from "./logger";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  try {
    logger.info("Sending email", { to, subject });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    logger.info("Email sent successfully", {
      messageId: info.messageId,
      to,
      subject,
    });
    return true;
  } catch (error: any) {
    logger.error("Email sending failed", {
      error: error.message,
      stack: error.stack,
      to,
      subject,
    });
    return false;
  }
};
