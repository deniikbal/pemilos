export interface Admin {
  id: string;
  username: string;
  created_at: string;
}

export interface Voter {
  id: string;
  nisn: string;
  nama: string;
  kelas: string;
  has_voted: boolean;
  created_at: string;
}

export interface Candidate {
  id: string;
  nama: string;
  foto_url?: string;
  visi: string;
  misi: string;
  created_at: string;
  vote_count?: number;
}

export interface Vote {
  id: string;
  voter_id: string;
  candidate_id: string;
  created_at: string;
  voter?: Voter;
  candidate?: Candidate;
}

export interface DashboardStats {
  total_voters: number;
  voted_count: number;
  not_voted_count: number;
  candidates_count: number;
  vote_results: Array<{
    candidate_id: string;
    candidate_name: string;
    vote_count: number;
  }>;
}

export interface AuthState {
  user: Admin | Voter | null;
  userType: 'admin' | 'voter' | null;
  token: string | null;
  isAuthenticated: boolean;
}