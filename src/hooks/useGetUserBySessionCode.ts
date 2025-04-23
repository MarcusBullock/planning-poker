import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { supabase } from "../clients/supabaseClient";
import { UserRow } from "../types/DbModels";

const getUserByGameCode = async (gameCode: string): Promise<UserRow> => {
  // Step 1: Fetch the session by game code
  const { data: session, error: sessionError } = await supabase
    .from("Session")
    .select("ownerUserId")
    .eq("code", gameCode)
    .single();

  if (sessionError) throw new Error(`Session Error: ${sessionError.message}`);
  if (!session) throw new Error("Session not found");

  // Step 2: Fetch the user by the ownerUserId
  const { data: user, error: userError } = await supabase
    .from("User")
    .select("*")
    .eq("id", session.ownerUserId)
    .single();

  if (userError) throw new Error(`User Error: ${userError.message}`);
  if (!user) throw new Error("User not found");

  return user;
};

export const useGetUserByGameCode = (
  gameCode: string
): UseQueryResult<UserRow, Error> => {
  return useQuery<UserRow, Error>({
    queryKey: ["UserByGameCode", gameCode],
    queryFn: () => getUserByGameCode(gameCode),
    enabled: !!gameCode,
  });
};
