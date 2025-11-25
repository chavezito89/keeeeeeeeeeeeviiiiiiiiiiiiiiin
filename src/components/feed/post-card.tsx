import Image from "next/image";
import type { KevinPost } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { LocationDisplay } from "./location-display";

interface PostCardProps {
  post: KevinPost;
}

export function PostCard({ post }: PostCardProps) {
  const { imageUrl, imageHint, comment, latitude, longitude, createdAt } = post;

  return (
    <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0 relative aspect-w-4 aspect-h-3">
        <Image
          src={imageUrl}
          alt={comment || "A sighting of Kevin"}
          width={600}
          height={450}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={imageHint}
        />
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        {comment && <p className="text-foreground">{comment}</p>}
      </CardContent>
      <CardFooter className="p-4 bg-secondary/30">
        <LocationDisplay 
          latitude={latitude} 
          longitude={longitude} 
          createdAt={createdAt} 
        />
      </CardFooter>
    </Card>
  );
}
