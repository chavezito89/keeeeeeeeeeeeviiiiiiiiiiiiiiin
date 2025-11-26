
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedGrid } from "./feed-grid";
import type { KevinPost } from "@/lib/types";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const FeedMap = dynamic(() => import('./feed-map').then(mod => mod.FeedMap), {
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-full" />,
});

interface FeedTabsProps {
    posts: KevinPost[];
}

export function FeedTabs({ posts }: FeedTabsProps) {
    return (
        <Tabs defaultValue="grid" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto mb-6">
                <TabsTrigger value="grid">Avistamientos</TabsTrigger>
                <TabsTrigger value="mapa">Kevin Mapa</TabsTrigger>
            </TabsList>
            <TabsContent value="grid">
                <FeedGrid posts={posts} />
            </TabsContent>
            <TabsContent value="mapa">
                <div className="aspect-[4/3] md:aspect-video w-full rounded-lg overflow-hidden border">
                    <FeedMap posts={posts} />
                </div>
            </TabsContent>
        </Tabs>
    );
}
