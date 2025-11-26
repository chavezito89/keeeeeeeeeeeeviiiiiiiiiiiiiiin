
"use client";

import { useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import type { KevinPost } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Pin } from 'lucide-react';


interface FeedMapProps {
    posts: KevinPost[];
    mapboxAccessToken?: string;
}

export function FeedMap({ posts, mapboxAccessToken }: FeedMapProps) {
    const [selectedPost, setSelectedPost] = useState<KevinPost | null>(null);

    const initialViewState = {
        longitude: -99.1332,
        latitude: 19.4326,
        zoom: 2,
        pitch: 45, // Añadimos una inclinación inicial para la vista 3D
        bearing: 0,
    };
    
    if (posts.length > 0) {
        const avgLat = posts.reduce((sum, post) => sum + post.latitude, 0) / posts.length;
        const avgLng = posts.reduce((sum, post) => sum + post.longitude, 0) / posts.length;
        initialViewState.latitude = avgLat;
        initialViewState.longitude = avgLng;
        initialViewState.zoom = posts.length > 1 ? 1 : 10;
    }


    return (
        <Map
            initialViewState={initialViewState}
            style={{width: '100%', height: '100%'}}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={mapboxAccessToken}
        >
            <NavigationControl position="top-right" />
            {posts.map(post => (
                <Marker 
                    key={post.id} 
                    longitude={post.longitude} 
                    latitude={post.latitude}
                    onClick={(e) => {
                        e.originalEvent.stopPropagation();
                        setSelectedPost(post);
                    }}
                >
                    <button type="button" className="cursor-pointer">
                        <Pin className="h-8 w-8 text-primary fill-primary/70" />
                    </button>
                </Marker>
            ))}

            {selectedPost && (
                <Popup
                    longitude={selectedPost.longitude}
                    latitude={selectedPost.latitude}
                    onClose={() => setSelectedPost(null)}
                    anchor="bottom"
                    closeOnClick={false}
                    offset={35}
                >
                    <div className="w-48">
                        <div className="relative aspect-4/3 mb-2 rounded-md overflow-hidden">
                            <Image src={selectedPost.imageUrl} alt={selectedPost.comment || "Sighting of Kevin"} fill className="object-cover" />
                        </div>
                        {selectedPost.comment && <p className="text-xs mb-2 truncate">{selectedPost.comment}</p>}
                        <Link href={`#post-${selectedPost.id}`} passHref>
                            <Button size="sm" className="w-full">Ver detalle</Button>
                        </Link>
                    </div>
                </Popup>
            )}
        </Map>
    );
}
