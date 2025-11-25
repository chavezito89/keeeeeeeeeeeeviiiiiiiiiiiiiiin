import type { KevinPost } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { formatDistanceToNow } from 'date-fns';

// This file contains mock data queries.
// Replace these with your actual Supabase queries.

const mockPosts: KevinPost[] = [
  {
    id: '1',
    imageUrl: PlaceHolderImages[0].imageUrl,
    imageHint: PlaceHolderImages[0].imageHint,
    comment: "Grabbing a coffee before the big meeting. The latte art is on point today!",
    latitude: 34.0522,
    longitude: -118.2437,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: '2',
    imageUrl: PlaceHolderImages[1].imageUrl,
    imageHint: PlaceHolderImages[1].imageHint,
    comment: "Enjoying a beautiful day at the park. Perfect weather for a walk.",
    latitude: 40.7128,
    longitude: -74.0060,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: '3',
    imageUrl: PlaceHolderImages[2].imageUrl,
    imageHint: PlaceHolderImages[2].imageHint,
    comment: "Met this friendly stray. I think he likes me!",
    latitude: 48.8566,
    longitude: 2.3522,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: '4',
    imageUrl: PlaceHolderImages[3].imageUrl,
    imageHint: PlaceHolderImages[3].imageHint,
    comment: "Reached the summit! The view is absolutely breathtaking. Worth the climb.",
    latitude: 36.3585,
    longitude: 138.7277,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
];


export async function getPosts(): Promise<KevinPost[]> {
  // MOCK: This function returns mock data.
  // TODO: Replace with your Supabase query to fetch posts.
  // Example:
  // const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
  // if (error) {
  //   console.error("Error fetching posts:", error);
  //   return [];
  // }
  // return data;

  console.log("Fetching mock posts...");
  // Add a small delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockPosts.map(post => ({
    ...post,
    createdAt: `${formatDistanceToNow(new Date(post.createdAt))} ago`,
  }));
}

export async function addPost(postData: Omit<KevinPost, 'id' | 'createdAt' | 'imageHint'>) {
    // MOCK: This function simulates adding a post.
    // TODO: Replace with your Supabase logic to insert a new post and upload the image.
    console.log("Adding new mock post:", postData);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real scenario, you would upload postData.imageUrl (the file) to Supabase storage
    // and then insert the post metadata with the public URL into your 'posts' table.
    
    return { success: true, message: "Post created successfully!" };
}
