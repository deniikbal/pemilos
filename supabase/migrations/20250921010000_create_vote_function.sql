-- Drop existing function
DROP FUNCTION IF EXISTS submit_vote_with_rls(uuid, uuid);

-- Create a simple function to handle voting with proper transaction
CREATE OR REPLACE FUNCTION submit_vote_with_rls(p_voter_id uuid, p_candidate_id uuid)
RETURNS TABLE(is_success boolean, result_message text, voter_name text, new_voted_status boolean)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    voter_info voters%ROWTYPE;
    existing_votes integer;
BEGIN
    -- Check if voter exists
    SELECT * INTO voter_info FROM voters WHERE id = p_voter_id;

    IF NOT FOUND THEN
        RETURN QUERY SELECT false::boolean, 'Voter tidak ditemukan'::text, NULL::text, false::boolean;
        RETURN;
    END IF;

    -- Check if already voted
    IF voter_info.has_voted THEN
        RETURN QUERY SELECT false::boolean, ('Voter ' || voter_info.nama || ' sudah melakukan voting')::text, voter_info.nama, true::boolean;
        RETURN;
    END IF;

    -- Check if already has vote record
    SELECT COUNT(*) INTO existing_votes FROM votes WHERE voter_id = p_voter_id;

    IF existing_votes > 0 THEN
        RETURN QUERY SELECT false::boolean, ('Voter ' || voter_info.nama || ' sudah memiliki record vote')::text, voter_info.nama, true::boolean;
        RETURN;
    END IF;

    -- Insert vote and update voter status in transaction
    BEGIN
        -- Insert the vote
        INSERT INTO votes (voter_id, candidate_id)
        VALUES (p_voter_id, p_candidate_id);

        -- Update voter has_voted status
        UPDATE voters
        SET has_voted = true
        WHERE id = p_voter_id;

        -- Return success
        RETURN QUERY SELECT true::boolean, 'Vote berhasil disubmit'::text, voter_info.nama, true::boolean;

    EXCEPTION WHEN OTHERS THEN
        -- Rollback and return error
        RETURN QUERY SELECT false::boolean, ('Error: ' || SQLERRM)::text, voter_info.nama, voter_info.has_voted;
    END;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION submit_vote_with_rls TO authenticated;
GRANT EXECUTE ON FUNCTION submit_vote_with_rls TO anon;