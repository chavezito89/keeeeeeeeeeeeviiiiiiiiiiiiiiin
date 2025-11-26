
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedGrid } from "./feed-grid";
import type { KevinPost } from "@/lib/types";

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
                <div className="aspect-[4/3] md:aspect-video w-full rounded-lg border bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">El mapa de Kevin estará disponible próximamente.</p>
                </div>
            </TabsContent>
        </Tabs>
    );
}
