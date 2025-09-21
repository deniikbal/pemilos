import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';
import { jwtDecode } from 'jwt-decode';
import { supabase } from '../lib/supabase';
import type { Admin, Voter } from '../types';

const JWT_SECRET = 'your-jwt-secret-key'; // In production, use environment variable

// Simple JWT implementation for browser
const createJWT = (payload: any, secret: string): string => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  
  const signature = CryptoJS.HmacSHA256(
    `${encodedHeader}.${encodedPayload}`,
    secret
  ).toString(CryptoJS.enc.Base64url);
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

const verifyJWT = (token: string, secret: string): any => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }
  
  const [header, payload, signature] = parts;
  
  // Verify signature
  const expectedSignature = CryptoJS.HmacSHA256(
    `${header}.${payload}`,
    secret
  ).toString(CryptoJS.enc.Base64url);
  
  if (signature !== expectedSignature) {
    throw new Error('Invalid token signature');
  }
  
  // Decode payload
  return JSON.parse(atob(payload));
};

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

  const isValidPassword = await bcrypt.compare(password, admin.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const token = createJWT(
    { 
      id: admin.id, 
      type: 'admin',
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    },
    JWT_SECRET
  );

  // Store token in localStorage for persistence
  localStorage.setItem('token', token);

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

  const token = createJWT(
    { 
      id: voter.id, 
      type: 'voter',
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    },
    JWT_SECRET
  );

  // Store token in localStorage for persistence
  localStorage.setItem('token', token);

  return {
    user: voter,
    token,
    userType: 'voter'
  };
};

export const verifyToken = (token: string) => {
  try {
    const decoded = verifyJWT(token, JWT_SECRET);
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};