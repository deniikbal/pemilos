import { supabase } from '../lib/supabase';
import type { Admin, Voter } from '../types';

const JWT_SECRET = 'your-jwt-secret-key'; // In production, use environment variable

export interface LoginResponse {
  user: Admin | Voter;
  token: string;
  userType: 'admin' | 'voter';
}

export const loginAdmin = async (username: string, password: string): Promise<LoginResponse> => {
  const { data: admin, error } = await supabase
    .from('admins')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !admin) {
    throw new Error('Invalid credentials');
  }

  // For demo purposes, accept "password" as valid password
  if (password !== 'password') {
    throw new Error('Invalid credentials');
  }

  // Create a simple token using base64 encoding for demo
  const token = btoa(JSON.stringify({
    id: admin.id,
    type: 'admin',
    timestamp: Date.now()
  }));

  return {
    user: admin,
    token,
    userType: 'admin'
  };
};

export const loginVoter = async (nisn: string): Promise<LoginResponse> => {
  const { data: voter, error } = await supabase
    .from('voters')
    .select('*')
    .eq('nisn', nisn)
    .single();

  if (error || !voter) {
    throw new Error('NISN tidak ditemukan');
  }

  // Create a simple token using base64 encoding for demo
  const token = btoa(JSON.stringify({
    id: voter.id,
    type: 'voter',
    timestamp: Date.now()
  }));

  return {
    user: voter,
    token,
    userType: 'voter'
  };
};

export const verifyToken = (token: string) => {
  try {
    // Decode the base64 token
    const decoded = JSON.parse(atob(token));

    // Check if token is expired (24 hours)
    const now = Date.now();
    const tokenAge = now - decoded.timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (tokenAge > maxAge) {
      throw new Error('Token expired');
    }

    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};