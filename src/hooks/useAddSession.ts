import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../clients/supabaseClient";
import { Database } from "../types/supabase";

type SessionInsert = Database["public"]["Tables"]["Session"]["Insert"];

const addSession = async (session: SessionInsert): Promise<void> => {
  const { error } = await supabase.from("Session").insert(session);
  if (error) throw new Error(error.message);
};

export const useAddSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Session"] });
    },
  });
};
