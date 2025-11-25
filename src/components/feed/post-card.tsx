"use client";

import Image from "next/image";
import { useState } from "react";
import type { KevinPost } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { LocationDisplay } from "./location-display";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CommentSection } from "./comment-section";

interface PostCardProps {
  post: KevinPost;
}

export function PostCard({ post }: PostCardProps) {
  const { id, imageUrl, imageHint, comment, latitude, longitude, createdAt } = post;
  const [locationDetails, setLocationDetails] = useState<{ country: string, city: string, countryCode: string } | null>(null);

  const flagUrl = locationDetails?.countryCode ? `https://flagcdn.com/w40/${locationDetails.countryCode.toLowerCase()}.png` : null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
          <CardHeader className="p-0 relative aspect-w-4 aspect-h-3">
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
          <CardContent className="p-6 flex-grow">
            {comment && <p className="text-foreground">{comment}</p>}
          </CardContent>
          <CardFooter className="p-4 bg-secondary/30">
            <LocationDisplay 
              latitude={latitude} 
              longitude={longitude} 
              createdAt={createdAt} 
              onLocationDetails={setLocationDetails}
            />
          </CardFooter>
        </Card>
      </DialogTrigger>
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
                  onLocationDetails={setLocationDetails}
                />
              </div>
              <div className="flex-grow flex flex-col min-h-0">
                  <h3 className="text-lg font-semibold mb-2">Comentarios</h3>
                  <CommentSection postId={id} />
              </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
