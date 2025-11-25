"use client";

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import { MapPin, Clock, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationDisplayProps {
    latitude: number;
    longitude: number;
    createdAt: string;
}

const customIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export function LocationDisplay({ latitude, longitude, createdAt }: LocationDisplayProps) {
    const [address, setAddress] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const mapId = useId();
    const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    const position: LatLngExpression = [latitude, longitude];

    useEffect(() => {
        const fetchAddress = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                if (data && data.display_name) {
                    setAddress(data.display_name);
                } else {
                    setAddress("Location details not found.");
                }
            } catch (error) {
                console.error("Error fetching address:", error);
                setAddress("Could not retrieve location name.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddress();
    }, [latitude, longitude]);

    return (
        <div className="w-full space-y-3">
            <div className="h-40 w-full rounded-md overflow-hidden border">
                 <MapContainer id={mapId} center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }} attributionControl={false} zoomControl={false}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position} icon={customIcon}></Marker>
                </MapContainer>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                 <Link href={gmapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 group/link flex-1 min-w-0">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                    <div className="flex flex-col min-w-0">
                        {isLoading ? (
                             <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin"/>
                                <span className="text-sm text-muted-foreground">Fetching location...</span>
                             </div>
                        ) : (
                            <span className="text-sm font-medium text-foreground group-hover/link:text-primary transition-colors truncate" title={address || ""}>
                                {address}
                            </span>
                        )}
                        <span className="text-xs text-muted-foreground group-hover/link:text-primary transition-colors">
                            View on Google Maps
                        </span>
                    </div>
                </Link>
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{createdAt}</span>
                </div>
            </div>
        </div>
    );
}
