import sendEmail from '../config/sendEmail';

async function send() {
  try {
    const response = await sendEmail({
      from: 'onboarding@resend.dev',
      to: 'tejeshmuralikrishna@gmail.com',
      subject: 'New user registration',
      html: '<p>You are registered as new user <strong>bookmyshow</strong>!</p>',
    });
    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export default { send };
