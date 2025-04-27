import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '../clients/supabaseClient';
import { SessionRow } from '../types/DbModels';

const getSession = async (sessionCode: string): Promise<SessionRow> => {
    const { data: session, error: sessionError } = await supabase
        .from('Session')
        .select('*')
        .eq('code', sessionCode)
        .single();

    if (sessionError) throw new Error(`Session Error: ${sessionError.message}`);
    if (!session) throw new Error('Session not found');

    return session;
};

export const useGetSession = (sessionCode: string): UseQueryResult<SessionRow, Error> => {
    return useQuery<SessionRow, Error>({
        queryKey: ['GetSession', sessionCode],
        queryFn: () => getSession(sessionCode),
        enabled: !!sessionCode,
    });
};
