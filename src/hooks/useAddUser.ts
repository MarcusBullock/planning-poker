import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../clients/supabaseClient";
import { Database } from "../types/supabase";

export type UserInsert = Database["public"]["Tables"]["User"]["Insert"];
export type UserRow = Database["public"]["Tables"]["User"]["Row"];

const addUser = async (user: UserInsert): Promise<UserRow> => {
  const { data, error } = await supabase
    .from("user")
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
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
