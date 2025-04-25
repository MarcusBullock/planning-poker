import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../clients/supabaseClient";
import { SessionInsert, SessionRow } from "../types/DbModels";

const addSession = async (session: SessionInsert): Promise<SessionRow> => {
  const { data, error } = await supabase
    .from("Session")
    .insert(session)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data!;
};

export const useAddSession = () => {
  const queryClient = useQueryClient();

  return useMutation<SessionRow, Error, SessionInsert>({
    mutationFn: addSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Session"] });
    },
  });
};
