
const nodemailer = require('nodemailer');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'email',
  auth: {
    user: 'zxy846067@gmail.com',
    pass: 'VBSPUharsh@24'
  }
});

// Function to send verification email
async function sendVerificationEmail(email, verificationCode) {
  const mailOptions = {
    from: 'zxy846067@gmail.com',
    to: email,
    subject: 'Email Verification',
    text: `Your verification code is: ${verificationCode}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent');
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

// Example usage

const verificationCode = Math.floor(Math.random()*15); // Generate a unique code for each user



module.exports=(userEmail)=>{
    return sendVerificationEmail(userEmail, verificationCode);
}