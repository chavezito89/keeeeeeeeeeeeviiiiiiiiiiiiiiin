
"use client";

import L, { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { KevinPost } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

// Fix for default icon issues with webpack
const customIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
});

interface FeedMapProps {
    posts: KevinPost[];
}

export function FeedMap({ posts }: FeedMapProps) {
    if (posts.length === 0) {
        return (
            <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        )
    }
    
    // Calculate the center of all posts
    const avgLat = posts.reduce((sum, post) => sum + post.latitude, 0) / posts.length;
    const avgLng = posts.reduce((sum, post) => sum + post.longitude, 0) / posts.length;
    const center: [number, number] = [avgLat, avgLng];

    return (
        <MapContainer center={center} zoom={posts.length > 1 ? 2 : 10} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {posts.map(post => (
                <Marker key={post.id} position={[post.latitude, post.longitude]} icon={customIcon}>
                    <Popup>
                        <div className="w-48">
                            <div className="relative aspect-4/3 mb-2 rounded-md overflow-hidden">
                                <Image src={post.imageUrl} alt={post.comment || "Sighting of Kevin"} fill className="object-cover" />
                            </div>
                            {post.comment && <p className="text-xs mb-2 truncate">{post.comment}</p>}
                            <Link href={`#post-${post.id}`} passHref>
                                <Button size="sm" className="w-full">Ver detalle</Button>
                            </Link>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
