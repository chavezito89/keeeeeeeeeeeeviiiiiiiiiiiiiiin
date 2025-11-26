
"use client";

import { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { es } from 'date-fns/locale';
import { Button } from "../ui/button";

interface LocationDisplayProps {
    latitude: number;
    longitude: number;
    onLocationDetails: (details: { country: string, city: string, countryCode: string }) => void;
    onViewOnMap: () => void;
}

export function LocationDisplay({ latitude, longitude, onLocationDetails, onViewOnMap }: LocationDisplayProps) {
    const [address, setAddress] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchAddress = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=es`);
                const data = await response.json();
                if (data) {
                    setAddress(data.display_name || "Detalles de la ubicación no encontrados.");
                    onLocationDetails({
                        city: data.address?.city || data.address?.town || data.address?.village || '',
                        country: data.address?.country || '',
                        countryCode: data.address?.country_code || '',
                    });
                } else {
                    setAddress("Detalles de la ubicación no encontrados.");
                }
            } catch (error) {
                console.error("Error fetching address:", error);
                setAddress("No se pudo recuperar el nombre de la ubicación.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [latitude, longitude]);

    return (
        <div className="overflow-hidden">
            <Button variant="link" onClick={onViewOnMap} className="flex items-start gap-2 group/link p-0 h-auto text-left">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                <div className="min-w-0">
                    {isLoading ? (
                         <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin"/>
                            <span className="text-sm text-muted-foreground">Buscando...</span>
                         </div>
                    ) : (
                        <span className="text-sm font-medium text-foreground group-hover/link:text-primary transition-colors truncate block" title={address || ""}>
                            {address}
                        </span>
                    )}
                    <span className="text-xs text-muted-foreground group-hover/link:text-primary transition-colors">
                        Ver en el mapa
                    </span>
                </div>
            </Button>
        </div>
    );
}
