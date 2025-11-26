
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedGrid } from "./feed-grid";
import { FeedMap } from "./feed-map";
import type { KevinPost } from "@/lib/types";
import dynamic from 'next/dynamic';
import { Skeleton } from "../ui/skeleton";

interface FeedTabsProps {
    posts: KevinPost[];
}

const DynamicFeedMap = dynamic(() => import('./feed-map').then(mod => mod.FeedMap), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});


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
                <div className="aspect-[4/3] md:aspect-video w-full rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                    <DynamicFeedMap posts={posts} />
                </div>
            </TabsContent>
        </Tabs>
    );
}
