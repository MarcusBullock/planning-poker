import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../clients/supabaseClient";
import { UserInsert, UserRow } from "../types/DbModels";

const addUser = async (user: UserInsert): Promise<UserRow> => {
  const { data, error } = await supabase
    .from("User")
    .insert(user)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data!;
};

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserRow, Error, UserInsert>({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["User"] });
    },
  });
};
