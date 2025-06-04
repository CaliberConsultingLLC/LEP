export default async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    if (!sendGridApiKey) {
      return res.status(500).json({ error: 'SendGrid API key not found in environment variables' });
    }
  
    console.log('SendGrid API Key (first 10 chars):', sendGridApiKey.substring(0, 10) + '...');
    res.status(200).json({ message: 'SendGrid API key is set (check server logs for confirmation)' });
  };