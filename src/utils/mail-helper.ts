import nodemailer from 'nodemailer';

const myEmail = '';

const setup = () =>
  nodemailer.createTransport({
    host: '',
    port: '',
    secure: false, // true for 465, false for other ports
    auth: {
      user: '', // generated ethereal user
      pass: '', // generated ethereal password
    },
  });

const confirmEmailTemplate = (user) =>
  `
  <h3>Hey ${user.username},</h3>
  <p>Please verify your account with us by visiting the following link.</p>
  <a href=${user.generateEmailConfirmationUrl()}>Confirm Account</a>
  <p>Alternatively, open the following url in your browser:</p> 
  <p>${user.generateEmailConfirmationUrl()}</p>
  <p>Thanks</p>
  <p>My Team</p>
  `;

export const sendConfirmationEmail = (user) => {
  const transporter = setup();

  // setup email data with unicode symbols
  const mail = {
    from: `"My Team" <${myEmail}>`,
    to: user.email,
    subject: 'My Account verification instructions',
    html: confirmEmailTemplate(user),
  };

  transporter.sendMail(mail);
};

const resetPasswordEmailTemplate = (user) =>
  `
  <h3>Hey ${user.username},</h3>
  <p>Please reset your password with us by visiting the following link.</p>
  <a href=${user.generateResetPasswordUrl()}>Reset Password</a>
  <p>Alternatively, open the following url in your browser:</p> 
  <p>${user.generateResetPasswordUrl()}</p>
  <p>Thanks</p>
  <p>My Team</p>
  `;

export const sendResetPasswordEmail = (user) => {
  const transporter = setup();

  // setup email data with unicode symbols
  const mail = {
    from: '"My Team" <${myEmail}>',
    to: user.email,
    subject: 'My Account reset password instructions',
    html: resetPasswordEmailTemplate(user),
  };

  transporter.sendMail(mail);
};
