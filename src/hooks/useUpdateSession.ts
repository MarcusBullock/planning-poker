import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { supabase } from '../clients/supabaseClient';
import { SessionRow } from '../types/DbModels';

type UpdateSessionVariables = {
    code: string;
    status: string;
};

const updateSession = async (variables: UpdateSessionVariables): Promise<SessionRow> => {
    const { code, status } = variables;
    const { data, error } = await supabase
        .from('Session')
        .update({ status })
        .eq('code', code)
        .select('*')
        .single();

    if (error) throw new Error(`Update Session Error: ${error.message}`);
    if (!data) throw new Error('Failed to update session');

    return data;
};

export const useUpdateSession = (
    options?: Omit<UseMutationOptions<SessionRow, Error, UpdateSessionVariables>, 'mutationFn'>,
): UseMutationResult<SessionRow, Error, UpdateSessionVariables> => {
    return useMutation({
        mutationFn: updateSession,
        ...options,
    });
};
