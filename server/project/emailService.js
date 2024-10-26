import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

//Edmund Fay
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: "agustina89@ethereal.email",
        pass: "czW2NRA1sgR2ddenH8"
    }
});


const sendEmailNotifications = async (projectInvestigators, projectTitle, adminEmail) => {
  if (!projectInvestigators || !Array.isArray(projectInvestigators) || projectInvestigators.length === 0) {
    return;
  }

  const emailPromises = projectInvestigators.map(investigator => {
    const mailOptions = {
      from: adminEmail,  // Using admin's email as sender
      to: investigator.email,
      subject: 'You have been added to a project!',
      text: `You have been added to the project: ${projectTitle}.\nProject added by: ${adminEmail}`,
    };
    return transporter.sendMail(mailOptions);
  });

  try {
    await Promise.all(emailPromises);
    console.log('Emails sent successfully');
  } catch (error) {
    console.error('Error sending email notifications:', error);
    throw new Error('Failed to send email notifications');
  }
};

export default sendEmailNotifications;