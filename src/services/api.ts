import { supabase } from '../lib/supabase';
import type { Candidate, Voter, DashboardStats, Vote } from '../types';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  // Get total voters
  const { count: total_voters } = await supabase
    .from('voters')
    .select('*', { count: 'exact', head: true });

  // Get voted count
  const { count: voted_count } = await supabase
    .from('voters')
    .select('*', { count: 'exact', head: true })
    .eq('has_voted', true);

  // Get candidates count
  const { count: candidates_count } = await supabase
    .from('candidates')
    .select('*', { count: 'exact', head: true });

  // Get vote results
  const { data: voteResults } = await supabase
    .from('votes')
    .select(`
      candidate_id,
      candidates!inner(nama)
    `);

  // Count votes per candidate
  const voteCounts: Record<string, { name: string; count: number }> = {};
  
  voteResults?.forEach(vote => {
    const candidateId = vote.candidate_id;
    const candidateName = vote.candidates.nama;
    
    if (!voteCounts[candidateId]) {
      voteCounts[candidateId] = { name: candidateName, count: 0 };
    }
    voteCounts[candidateId].count++;
  });

  const vote_results = Object.entries(voteCounts).map(([candidate_id, data]) => ({
    candidate_id,
    candidate_name: data.name,
    vote_count: data.count
  }));

  return {
    total_voters: total_voters || 0,
    voted_count: voted_count || 0,
    not_voted_count: (total_voters || 0) - (voted_count || 0),
    candidates_count: candidates_count || 0,
    vote_results
  };
};

export const getCandidates = async (): Promise<Candidate[]> => {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const createCandidate = async (candidate: Omit<Candidate, 'id' | 'created_at'>): Promise<Candidate> => {
  const { data, error } = await supabase
    .from('candidates')
    .insert([candidate])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCandidate = async (id: string, candidate: Partial<Candidate>): Promise<Candidate> => {
  const { data, error } = await supabase
    .from('candidates')
    .update(candidate)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCandidate = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('candidates')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getVoters = async (): Promise<Voter[]> => {
  const { data, error } = await supabase
    .from('voters')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createVoter = async (voter: Omit<Voter, 'id' | 'created_at' | 'has_voted'>): Promise<Voter> => {
  const { data, error } = await supabase
    .from('voters')
    .insert([{ ...voter, password_hash: voter.nisn }]) // Use NISN as default password
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateVoter = async (id: string, voter: Partial<Voter>): Promise<Voter> => {
  const { data, error } = await supabase
    .from('voters')
    .update(voter)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteVoter = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('voters')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export interface VoteResult {
  is_success: boolean;
  result_message: string;
  voter_name?: string;
  new_voted_status?: boolean;
}

export const submitVote = async (voterId: string, candidateId: string): Promise<VoteResult> => {
  console.log('🗳️ Submitting vote via RPC:', { voterId, candidateId });

  // Use RPC function to handle voting with proper transaction and RLS bypass
  const { data: result, error } = await supabase
    .rpc('submit_vote_with_rls', {
      p_voter_id: voterId,
      p_candidate_id: candidateId
    });

  console.log('📋 RPC Response:', { result, error });

  if (error) {
    console.error('❌ RPC Error:', error);
    throw new Error('Gagal submit vote: ' + error.message);
  }

  if (!result || result.length === 0) {
    console.error('❌ No result from RPC call');
    throw new Error('Tidak ada response dari server');
  }

  const voteResult = result[0];
  console.log('📊 Vote Result:', voteResult);

  // Return the result object instead of throwing error
  // This allows the component to handle different scenarios
  if (!voteResult.is_success) {
    console.log('⚠️ Vote not successful:', voteResult.result_message);
  } else {
    console.log('✅ Vote submitted successfully!', {
      voter: voteResult.voter_name,
      has_voted: voteResult.new_voted_status,
      message: voteResult.result_message
    });
  }

  return voteResult;
};

export const resetVoting = async (): Promise<{ votes_deleted: number; voters_reset: number; message: string }> => {
  console.log('🔄 Resetting voting via RPC...');

  // Use RPC function to handle voting reset with proper transaction and RLS bypass
  const { data: result, error } = await supabase
    .rpc('reset_voting_alternative');

  console.log('📋 RPC Response:', { result, error });

  if (error) {
    console.error('❌ RPC Error:', error);
    throw new Error('Gagal reset voting: ' + error.message);
  }

  if (!result || result.length === 0) {
    console.error('❌ No result from RPC call');
    throw new Error('Tidak ada response dari server');
  }

  const resetResult = result[0];
  console.log('📊 Reset Result:', resetResult);

  if (!resetResult.is_success) {
    console.error('❌ Reset failed:', resetResult.result_message);
    throw new Error(resetResult.result_message);
  }

  console.log('✅ Voting reset successfully!', {
    votes_deleted: resetResult.votes_deleted,
    voters_reset: resetResult.voters_reset,
    message: resetResult.result_message
  });

  return {
    votes_deleted: resetResult.votes_deleted,
    voters_reset: resetResult.voters_reset,
    message: resetResult.result_message
  };
};

export const getVotingResults = async (): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from('votes')
    .select(`
      *,
      voters(nama, kelas, nisn),
      candidates(nama)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};