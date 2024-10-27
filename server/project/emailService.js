// emailService.js

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // use Gmail service
  auth: {
    user: "prateek6581@gmail.com", // your Gmail account email
    pass: "yahb hseo kheo ahoj", // your Gmail app password or OAuth token
  },
});

const sendEmailNotifications = async (
  projectInvestigators,
  projectTitle,
  adminName,
  adminEmail
) => {
  if (
    !projectInvestigators ||
    !Array.isArray(projectInvestigators) ||
    projectInvestigators.length === 0
  ) {
    return;
  }

  const emailPromises = projectInvestigators.map((investigator) => {
    const mailOptions = {
      from: {
        name: adminName,
        address: adminEmail,
      },
      to: investigator.email,
      subject: "You have been added to a project!",
      text: `You have been added to the project: ${projectTitle}.\nProject added by: ${adminName} (${adminEmail})`,
    };
    return transporter.sendMail(mailOptions);
  });

  try {
    await Promise.all(emailPromises);
    console.log("Emails sent successfully");
  } catch (error) {
    console.error("Error sending email notifications:", error);
    throw new Error("Failed to send email notifications");
  }
};

export default sendEmailNotifications;
