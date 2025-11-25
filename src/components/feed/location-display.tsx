"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Clock, Loader2 } from "lucide-react";

interface LocationDisplayProps {
    latitude: number;
    longitude: number;
    createdAt: string;
    onLocationDetails: (details: { country: string, city: string, countryCode: string }) => void;
}

export function LocationDisplay({ latitude, longitude, createdAt, onLocationDetails }: LocationDisplayProps) {
    const [address, setAddress] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    
    useEffect(() => {
        const fetchAddress = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=es`);
                const data = await response.json();
                if (data) {
                    setAddress(data.display_name || "Location details not found.");
                    onLocationDetails({
                        city: data.address?.city || data.address?.town || data.address?.village || '',
                        country: data.address?.country || '',
                        countryCode: data.address?.country_code || '',
                    });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [latitude, longitude]);

    return (
        <div className="w-full space-y-3">
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
