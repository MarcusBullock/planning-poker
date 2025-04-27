import { supabase } from '../clients/supabaseClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { UserRow } from '../types/DbModels';

type UpdateUserVariables = {
    id: number;
    vote?: number | null;
    suit?: string;
};

const updateUser = async (variables: UpdateUserVariables): Promise<UserRow> => {
    const { vote, suit, id } = variables;
    const { data, error } = await supabase
        .from('User')
        .update({ vote, suit })
        .eq('id', id)
        .select('*')
        .single();

    if (error) throw new Error(`Update Session Error: ${error.message}`);
    if (!data) throw new Error('Failed to update session');

    return data;
};

export const useUpdateUser = (
    options?: Omit<UseMutationOptions<UserRow, Error, UpdateUserVariables>, 'mutationFn'>,
): UseMutationResult<UserRow, Error, UpdateUserVariables> => {
    return useMutation({
        mutationFn: updateUser,
        ...options,
    });
};
