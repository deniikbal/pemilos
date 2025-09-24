-- Alternative function to reset voting with different approach
DROP FUNCTION IF EXISTS reset_voting_alternative();

CREATE OR REPLACE FUNCTION reset_voting_alternative()
RETURNS TABLE(is_success boolean, result_message text, votes_deleted integer, voters_reset integer)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    votes_count integer;
    voters_count integer;
BEGIN
    -- Count existing votes before deletion
    SELECT COUNT(*) INTO votes_count FROM votes;

    -- Count voters who have voted
    SELECT COUNT(*) INTO voters_count FROM voters WHERE has_voted = true;

    -- Delete all votes using a subquery approach
    DELETE FROM votes WHERE id IN (SELECT id FROM votes);

    -- Reset all voters has_voted status only for those who have voted
    UPDATE voters SET has_voted = false WHERE id IN (SELECT id FROM voters WHERE has_voted = true);

    -- Return success result
    RETURN QUERY SELECT
        true::boolean,
        ('Reset voting berhasil: ' || votes_count || ' suara dihapus, ' || voters_count || ' voter direset')::text,
        votes_count,
        voters_count;

EXCEPTION WHEN OTHERS THEN
    -- Return error result
    RETURN QUERY SELECT
        false::boolean,
        ('Error reset voting: ' || SQLERRM)::text,
        0,
        0;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION reset_voting_alternative TO authenticated;
GRANT EXECUTE ON FUNCTION reset_voting_alternative TO anon;