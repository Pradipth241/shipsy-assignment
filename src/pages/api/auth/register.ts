// src/pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { readDB, writeDB } from '@/lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { username, password } = req.body;
  
  const db = await readDB();
  if (db.users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: `user_${Date.now()}`, username, password: hashedPassword };
  db.users.push(newUser);
  await writeDB(db);
  
  res.status(201).json({ message: 'User created' });
}