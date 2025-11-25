import type { KevinComment } from "@/lib/types";
import { supabase } from "./client";

export async function getComments(postId: number): Promise<KevinComment[]> {
  const { data, error } = await supabase
    .from('post_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
  return data;
}
