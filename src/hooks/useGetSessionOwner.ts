import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '../clients/supabaseClient';
import { UserRow } from '../types/DbModels';

const getSessionOwner = async (sessionCode: string): Promise<UserRow> => {
    const { data: user, error } = await supabase
        .from('User')
        .select('*')
        .eq('sessionCode', sessionCode)
        .eq('role', 'owner')
        .single();

    if (error) throw new Error(`User Error: ${error.message}`);
    if (!user) throw new Error('User not found');

    return user;
};

export const useGetSessionOwner = (gameCode: string): UseQueryResult<UserRow, Error> => {
    return useQuery<UserRow, Error>({
        queryKey: ['UserByGameCode', gameCode],
        queryFn: () => getSessionOwner(gameCode),
        enabled: !!gameCode,
    });
};
