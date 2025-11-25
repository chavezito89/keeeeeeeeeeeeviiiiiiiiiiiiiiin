import type { KevinPost } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { supabase, supabaseServer } from "./client";

export async function getPosts(): Promise<KevinPost[]> {
  const { data, error } = await supabase
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
    createdAt: `${formatDistanceToNow(new Date(post.created_at))} ago`,
  }));
}

export async function addPost(postData: Omit<KevinPost, 'id' | 'createdAt' | 'imageHint'> & { image_url: string }) {
    const { image_url, comment, latitude, longitude } = postData;
    
    const { data, error } = await supabaseServer
        .from('posts')
        .insert([
            { 
                image_url,
                comment,
                latitude,
                longitude,
            }
        ])
        .select();

    if (error) {
        console.error("Error adding post:", error);
        throw new Error("Failed to add post to the database.");
    }
    
    return data;
}

export async function uploadPostImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabaseServer.storage.from('posts').upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error('Image upload failed.');
    }

    const { data } = supabase.storage.from('posts').getPublicUrl(filePath);

    return data.publicUrl;
}
