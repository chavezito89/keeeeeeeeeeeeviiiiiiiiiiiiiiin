import type { KevinPost, KevinComment } from "@/lib/types";
import { supabase } from "./client";
import { supabaseServer } from "./server";

export async function getPosts(): Promise<KevinPost[]> {
  const { data, error } = await supabaseServer
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
  
  return data.map(post => ({
    id: post.id,
    imageUrl: post.image_url,
    imageHint: '', // This can be removed if not needed or generated differently
    comment: post.comment,
    latitude: post.latitude,
    longitude: post.longitude,
    createdAt: post.created_at, // Pass raw date string
  }));
}

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
