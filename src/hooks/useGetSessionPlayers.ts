import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '../clients/supabaseClient';
import { UserRow } from '../types/DbModels';

const getSessionPlayers = async (sessionCode: string): Promise<UserRow[]> => {
    const { data: sessionUsers, error: sessionError } = await supabase
        .from('SessionUser')
        .select('userId')
        .eq('sessionCode', sessionCode);

    if (sessionError) throw new Error(`Session Error: ${sessionError.message}`);
    if (!sessionUsers || sessionUsers.length === 0) throw new Error('Session not found');

    const userIds = sessionUsers.map((sessionUser) => sessionUser.userId);
    const { data: users, error: userError } = await supabase
        .from('User')
        .select('*')
        .in('id', userIds);

    if (userError) throw new Error(`User Error: ${userError.message}`);
    if (!users || users.length === 0) throw new Error('No user details found');

    return users;
};

export const useGetSessionPlayers = (sessionCode: string): UseQueryResult<UserRow[], Error> => {
    return useQuery<UserRow[], Error>({
        queryKey: ['UsersBySessionCode', sessionCode],
        queryFn: () => getSessionPlayers(sessionCode),
        enabled: !!sessionCode,
    });
};
