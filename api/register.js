// This file runs on Vercel as a Serverless Function
// It takes the form data and saves it to your GitHub repository as a JSON file

import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, grade, phone, email, message } = req.body;

  // Basic Validation
  if (!name || !phone || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Get environment variables from Vercel Project Settings
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;  // Your GitHub Personal Access Token
  const REPO_OWNER = process.env.REPO_OWNER;      // Your GitHub Username
  const REPO_NAME = process.env.REPO_NAME;        // Your Repository Name

  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
    return res.status(500).json({ message: 'Server Configuration Error: Missing Env Vars' });
  }

  const octokit = new Octokit({
    auth: GITHUB_TOKEN,
  });

  try {
    // Create a unique filename based on timestamp and name
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `registrations/${timestamp}_${name.replace(/\s/g, '_')}.json`;

    // Prepare the data to be saved
    const data = {
      name,
      grade,
      phone,
      email,
      message,
      submittedAt: new Date().toISOString(),
    };

    // Use the GitHub API to create a file in the repository
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filename,
      message: `Add registration: ${name}`,
      content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
    });

    return res.status(200).json({
      message: 'Registration successful!',
      data: data,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      message: 'Error saving registration',
      error: error.message,
    });
  }
}
