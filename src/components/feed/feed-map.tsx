
"use client";

import { useState, useRef, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, MapRef } from 'react-map-gl';
import type { KevinPost } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Pin } from 'lucide-react';


interface FeedMapProps {
    posts: KevinPost[];
    mapboxAccessToken?: string;
    flyToPost?: KevinPost | null;
}

export function FeedMap({ posts, mapboxAccessToken, flyToPost }: FeedMapProps) {
    const [selectedPost, setSelectedPost] = useState<KevinPost | null>(null);
    const mapRef = useRef<MapRef>(null);

    const initialViewState = {
        longitude: -99.1332,
        latitude: 19.4326,
        zoom: 2,
        pitch: 45,
        bearing: 0,
    };
    
    if (posts.length > 0 && !flyToPost) {
        const avgLat = posts.reduce((sum, post) => sum + post.latitude, 0) / posts.length;
        const avgLng = posts.reduce((sum, post) => sum + post.longitude, 0) / posts.length;
        initialViewState.latitude = avgLat;
        initialViewState.longitude = avgLng;
        initialViewState.zoom = posts.length > 1 ? 1 : 10;
    }

    const flyToLocation = (post: KevinPost) => {
         mapRef.current?.flyTo({
            center: [post.longitude, post.latitude],
            zoom: 16,
            pitch: 60,
            duration: 2000
        });
    };

    useEffect(() => {
        if (flyToPost && mapRef.current) {
            setSelectedPost(flyToPost);
            flyToLocation(flyToPost);
        }
    }, [flyToPost]);


    const handleMarkerClick = (post: KevinPost) => {
        setSelectedPost(post);
        flyToLocation(post);
    };


    return (
        <Map
            ref={mapRef}
            initialViewState={flyToPost ? undefined : initialViewState}
            style={{width: '100%', height: '100%'}}
            mapStyle="mapbox://styles/chavezzz8909/cmighf4qx003y01sth8iy07kz"
            mapboxAccessToken={mapboxAccessToken}
            fog={{
                "range": [0.8, 8],
                "color": "#dc9f9f",
                "horizon-blend": 0.5,
                "high-color": "#245bde",
                "space-color": "#000000",
                "star-intensity": 0.15
            }}
            onLoad={(e) => {
                const map = e.target;
                map.setConfigProperty('basemap', 'show3dBuildings', true);
                 if (flyToPost) {
                    // Timeout to ensure map is fully loaded and ready for animation
                    setTimeout(() => {
                        setSelectedPost(flyToPost);
                        flyToLocation(flyToPost);
                    }, 500)
                }
            }}
        >
            <NavigationControl position="top-right" />
            {posts.map(post => (
                <Marker 
                    key={post.id} 
                    longitude={post.longitude} 
                    latitude={post.latitude}
                    onClick={(e) => {
                        e.originalEvent.stopPropagation();
                        handleMarkerClick(post);
                    }}
                >
                    <button type="button" className="cursor-pointer transform transition-transform hover:scale-110">
                        <Pin className="h-8 w-8 text-primary fill-primary/70" style={{filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'}} />
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
                    <div className="w-48 rounded-md overflow-hidden">
                        <Image src={selectedPost.imageUrl} alt={selectedPost.comment || "Sighting of Kevin"} width={192} height={144} className="object-cover mb-2 rounded-t-md" />
                        {selectedPost.comment && <p className="text-xs mb-2 px-1 truncate">{selectedPost.comment}</p>}
                        <div className="px-1 pb-1">
                            <Link href={`/feed#post-${selectedPost.id}`} passHref>
                                <Button size="sm" className="w-full">Ver detalle</Button>
                            </Link>
                        </div>
                    </div>
                </Popup>
            )}
        </Map>
    );
}
