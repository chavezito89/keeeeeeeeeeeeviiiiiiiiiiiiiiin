"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import type { KevinPost, KevinComment } from "@/lib/types";
import { getComments } from "@/lib/supabase/queries";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { LocationDisplay } from "./location-display";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CommentSection } from "./comment-section";
import { Button } from "../ui/button";
import { MessageSquare, Forward, Clock } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface PostCardProps {
  post: KevinPost;
}

export function PostCard({ post }: PostCardProps) {
  const { id, imageUrl, imageHint, comment, latitude, longitude, createdAt } = post;
  const [locationDetails, setLocationDetails] = useState<{ country: string, city: string, countryCode: string } | null>(null);
  const [comments, setComments] = useState<KevinComment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      const fetchedComments = await getComments(id);
      setComments(fetchedComments);
    }
    fetchComments();
  }, [id]);

  const flagUrl = locationDetails?.countryCode ? `https://flagcdn.com/w40/${locationDetails.countryCode.toLowerCase()}.png` : null;
  const latestComment = comments.length > 0 ? comments[comments.length - 1] : null;
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: es });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <DialogTrigger asChild>
          <CardHeader className="p-0 relative aspect-w-4 aspect-h-3 cursor-pointer">
              <Image
                src={imageUrl}
                alt={comment || "A sighting of Kevin"}
                width={600}
                height={450}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={imageHint}
              />
              {locationDetails && (
                <div className="absolute top-0 left-0 p-3 bg-gradient-to-r from-black/70 to-transparent rounded-br-lg">
                  <div className="flex items-center gap-2">
                    {flagUrl && <Image src={flagUrl} alt={`${locationDetails.country} flag`} width={24} height={16} className="rounded-sm" />}
                    <div>
                      <p className="font-bold text-white text-sm leading-tight">{locationDetails.city}</p>
                      <p className="text-white/90 text-xs leading-tight">{locationDetails.country}</p>
                    </div>
                  </div>
                </div>
              )}
          </CardHeader>
        </DialogTrigger>
        <CardContent className="p-6 flex-grow">
          {comment && <p className="text-foreground mb-4">{comment}</p>}
          
           <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <span>{formattedDate}</span>
            </div>

          {latestComment && (
             <div className="relative rounded-lg bg-accent/50 border border-border/50 p-3 pr-8 text-sm">
                <p className="font-bold text-xs text-primary">{latestComment.username}</p>
                <p className="text-foreground text-ellipsis overflow-hidden whitespace-nowrap">{latestComment.comment}</p>
                <div className="absolute top-2 right-2 text-muted-foreground">
                  <Forward className="h-4 w-4" />
                </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 bg-secondary/30 flex justify-between items-center">
          <LocationDisplay 
            latitude={latitude} 
            longitude={longitude} 
            createdAt={createdAt} 
            onLocationDetails={setLocationDetails}
          />
           <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
              <MessageSquare className="h-4 w-4"/>
              <span>{comments.length}</span>
            </Button>
          </DialogTrigger>
        </CardFooter>
      </Card>

      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col md:flex-row p-0">
        <div className="relative w-full md:w-2/3 h-64 md:h-auto">
            <Image
                src={imageUrl}
                alt={comment || "A sighting of Kevin"}
                fill
                className="object-cover"
                data-ai-hint={imageHint}
            />
        </div>
        <div className="w-full md:w-1/3 flex flex-col">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle>Avistamiento de Kevin</DialogTitle>
            </DialogHeader>
            <div className="p-6 pt-0 flex-grow flex flex-col">
              {comment && <p className="text-sm text-foreground mb-4">{comment}</p>}
              <div className="mb-4">
                <LocationDisplay
                  latitude={latitude}
                  longitude={longitude}
                  createdAt={createdAt}
                  onLocationDetails={() => {}}
                />
              </div>
              <div className="flex-grow flex flex-col min-h-0">
                  <h3 className="text-lg font-semibold mb-2">Comentarios</h3>
                  <CommentSection 
                    postId={id} 
                    initialComments={comments} 
                    onCommentsUpdate={setComments}
                  />
              </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
