const sgMail = require('@sendgrid/mail');
const fs = require('fs').promises;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, campaignLink, password, eventDate } = req.body;
  if (!to || !subject || !campaignLink || !password || !eventDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    const pdfPath = 'C:\\Users\\dusti\\LEP\\PDF\\report.pdf'; // Replace 'report.pdf' with your PDF filename
    const pdfData = await fs.readFile(pdfPath);
    const pdfBase64 = pdfData.toString('base64');

    const msg = {
      to,
      from: 'dustin@caliberconsultingllc.org', // Replace with your verified SendGrid sender email
      subject,
      text: `Dear User,\n\nHere are your personalized details:\n- Campaign Link: ${campaignLink}\n- Password: ${password}\n- Event Date: ${eventDate}\n\nPlease find the attached PDF with more information.`,
      attachments: [
        {
          content: pdfBase64,
          filename: 'One-pager.pdf', // Replace with your PDF filename
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    };

    await sgMail.send(msg);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};