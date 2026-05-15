import { getAllResponses, addResponse } from '../db/index.js';

export async function getResponses(req, res) {
  try {
    const responses = await getAllResponses();
    res.json(responses);
  } catch (error) {
    console.error('Failed to load responses:', error);
    res.status(500).json({ error: 'Unable to load responses' });
  }
}

export async function createResponse(req, res) {
  try {
    const savedResponse = await addResponse(req.body);
    res.status(201).json(savedResponse);
  } catch (error) {
    console.error('Failed to save response:', error);
    res.status(500).json({ error: 'Unable to save response' });
  }
}
