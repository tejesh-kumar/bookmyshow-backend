import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  from: string;
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ from, to, subject, html }: EmailParams) {
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
  return { success: true, data };
}

export default sendEmail;
