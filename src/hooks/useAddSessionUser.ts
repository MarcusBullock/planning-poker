import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../clients/supabaseClient";
import { SessionUserInsert } from "../types/DbModels";

const addSessionUser = async (
  sessionUser: SessionUserInsert
): Promise<void> => {
  const { error } = await supabase.from("SessionUser").insert(sessionUser);
  if (error) throw new Error(error.message);
};

export const useAddSessionUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSessionUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SessionUser"] });
    },
  });
};
