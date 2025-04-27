import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '../clients/supabaseClient';
import { UserRow } from '../types/DbModels';

const getSessionPlayers = async (sessionCode: string): Promise<UserRow[]> => {
    const { data: users, error } = await supabase
        .from('User')
        .select('*')
        .eq('sessionCode', sessionCode);

    if (error) throw new Error(`User Error: ${error.message}`);
    if (!users || users.length === 0) throw new Error('User not found');

    return users;
};

export const useGetSessionPlayers = (sessionCode: string): UseQueryResult<UserRow[], Error> => {
    return useQuery<UserRow[], Error>({
        queryKey: ['UsersBySessionCode', sessionCode],
        queryFn: () => getSessionPlayers(sessionCode),
        enabled: !!sessionCode,
    });
};
