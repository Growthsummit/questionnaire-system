import { getAdminByUsername } from '../db/index.js';

export async function login(req, res) {
  const { username, password } = req.body || {};
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const admin = await getAdminByUsername(username);
    
    if (admin && admin.password === password) {
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      return res.json({ token });
    }
    
    return res.status(401).json({ error: 'Invalid username or password' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Database connection error. Please try again later.' });
  }
}
