import { supabaseServer } from "@/lib/supabase/server";
import { AppHeader } from "@/components/shared/app-header";
import { FeedClient } from "@/components/feed/feed-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { KevinPost } from "@/lib/types";

async function getPosts(): Promise<KevinPost[]> {
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
    imageHint: '',
    comment: post.comment,
    latitude: post.latitude,
    longitude: post.longitude,
    createdAt: post.created_at,
  }));
}

function FeedSkeleton() {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Skeleton className="h-8 w-1/3 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default async function FeedPage() {
  const posts = await getPosts();

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <Suspense fallback={<FeedSkeleton />}>
            <FeedClient posts={posts} />
        </Suspense>
      </main>
    </div>
  );
}
