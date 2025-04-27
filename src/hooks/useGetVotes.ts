import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '../clients/supabaseClient';
import { UserVote } from '../types/UserVote';

const getVotes = async (sessionCode: string): Promise<UserVote[]> => {
    const { data: users, error } = await supabase
        .from('User')
        .select('*')
        .eq('sessionCode', sessionCode);

    if (error) throw new Error(`User Error: ${error.message}`);
    if (!users || users.length === 0) throw new Error('User not found');

    return users.map((user) => ({
        userId: user.id,
        userName: user.name,
        vote: user.vote,
        suit: user.suit,
        isVisible: false,
        highlight: true,
    }));
};

export const useGetVotes = (sessionCode: string): UseQueryResult<UserVote[], Error> => {
    return useQuery<UserVote[], Error>({
        queryKey: ['GetUserVotes', sessionCode],
        queryFn: () => getVotes(sessionCode),
        enabled: !!sessionCode,
    });
};
