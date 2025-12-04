// This file runs on Vercel as a Serverless Function
// It handles POST requests from the registration form

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, grade, phone, email, message } = req.body;

    // Basic Validation
    if (!name || !phone || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // TODO: Implement the storage logic
    // Option 1: Save to database
    // Option 2: Send email notification
    // Option 3: Save to Google Sheet
    // Option 4: Create GitHub issue/file

    console.log('New registration:', { name, grade, phone, email, message });

    return res.status(200).json({
      message: 'Registration successful!',
      data: { name, grade, phone, email, message }
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      message: 'Error saving registration',
      error: error.message
    });
  }
}
