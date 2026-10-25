const nodemailer = require('nodemailer');

let transporter;

const getTransporter = () => {
  const user = process.env.GMAIL_USER?.trim();
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '');

  if (!user || !password) {
    throw new Error('Gmail notifications are not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.');
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass: password },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000
    });
  }

  return { transporter, user };
};

const sendContactNotification = async (message) => {
  const { transporter: mailer, user } = getTransporter();
  const recipient = process.env.CONTACT_NOTIFICATION_EMAIL?.trim() || user;
  const subject = (message.subject || 'General Inquiry')
    .replace(/[\r\n]+/g, ' ')
    .slice(0, 180);

  await mailer.sendMail({
    from: user,
    to: recipient,
    replyTo: message.email,
    subject: `[Portfolio Contact] ${subject}`,
    text: [
      'A new message was submitted through your portfolio contact form.',
      '',
      `Name: ${message.name}`,
      `Email: ${message.email}`,
      `Subject: ${message.subject || 'General Inquiry'}`,
      `Project type: ${message.projectType || 'Not specified'}`,
      `Telegram: ${message.telegram || 'Not provided'}`,
      '',
      'Message:',
      message.message
    ].join('\n')
  });
};

module.exports = { sendContactNotification };
