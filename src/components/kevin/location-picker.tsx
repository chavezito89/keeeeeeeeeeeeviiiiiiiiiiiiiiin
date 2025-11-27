"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Map, { Marker, NavigationControl, MapRef } from 'react-map-gl';
import { Label } from '@/components/ui/label';
import { Loader2, MapPin, LocateFixed, Pin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface LocationPickerProps {
    mapboxToken?: string;
}

export function LocationPicker({ mapboxToken }: LocationPickerProps) {
    const { toast } = useToast();
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [marker, setMarker] = useState<{ latitude: number, longitude: number } | null>(null);

    const mapRef = useRef<MapRef | null>(null);

    const updateHiddenInputs = useCallback((lat: number | null, lng: number | null) => {
        const latInput = document.querySelector('input[name="latitude"]') as HTMLInputElement;
        const lonInput = document.querySelector('input[name="longitude"]') as HTMLInputElement;
        if (latInput && lonInput) {
            latInput.value = lat?.toString() || '';
            lonInput.value = lng?.toString() || '';
        }
    }, []);

    const handleMapClick = (e: mapboxgl.MapLayerMouseEvent) => {
        const { lng, lat } = e.lngLat;
        setMarker({ latitude: lat, longitude: lng });
        updateHiddenInputs(lat, lng);
    };

    const centerOnUserLocation = useCallback(() => {
        if (!navigator.geolocation) {
             toast({
                variant: "destructive",
                title: "Geolocalización no soportada",
                description: "Tu navegador no permite obtener la ubicación.",
            });
            return;
        }
        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setMarker({ latitude, longitude });
                updateHiddenInputs(latitude, longitude);
                
                mapRef.current?.flyTo({
                    center: [longitude, latitude],
                    zoom: 14,
                    pitch: 45,
                });
                setIsGettingLocation(false);
            },
            (error) => {
                setIsGettingLocation(false);
                toast({
                    variant: "destructive",
                    title: "Error de ubicación",
                    description: "No se pudo obtener la ubicación. Por favor, activa los servicios de ubicación en tu navegador.",
                });
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, [toast, updateHiddenInputs]);

    const handleReset = useCallback(() => {
         mapRef.current?.flyTo({
            center: [-99.1332, 19.4326], // Mexico City
            zoom: 2,
            pitch: 0,
         });
         setMarker(null);
         updateHiddenInputs(null, null);
    }, [updateHiddenInputs])
    
    useEffect(() => {
        centerOnUserLocation();
        window.addEventListener('resetMap', handleReset);
        return () => {
            window.removeEventListener('resetMap', handleReset);
        };
    }, [centerOnUserLocation, handleReset]);
    
    const initialViewState = {
        longitude: -99.1332,
        latitude: 19.4326,
        zoom: 2,
        pitch: 0,
        bearing: 0,
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <div>
                    <Label className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Ubicación del avistamiento</Label>
                    <p className="text-sm text-muted-foreground">Haz clic en el mapa para marcar el punto exacto.</p>
                </div>
                <Button variant="outline" size="sm" onClick={centerOnUserLocation} disabled={isGettingLocation}>
                    {isGettingLocation ? <Loader2 className="h-4 w-4 animate-spin"/> : <LocateFixed className="h-4 w-4"/>}
                    <span className="ml-2 hidden sm:inline">Usar mi ubicación</span>
                </Button>
            </div>
            <div className="relative h-80 w-full rounded-md overflow-hidden border bg-muted">
                {mapboxToken ? (
                     <Map
                        ref={mapRef}
                        mapboxAccessToken={mapboxToken}
                        initialViewState={initialViewState}
                        style={{width: '100%', height: '100%'}}
                        mapStyle="mapbox://styles/chavezzz8909/cmighf4qx003y01sth8iy07kz"
                        onClick={handleMapClick}
                        cursor='crosshair'
                     >
                        <NavigationControl position="top-right" />
                        {marker && (
                            <Marker longitude={marker.longitude} latitude={marker.latitude}>
                                 <Pin className="h-8 w-8 text-primary fill-primary/70 -translate-y-4" style={{filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'}} />
                            </Marker>
                        )}
                     </Map>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        Cargando mapa...
                    </div>
                )}
            </div>
             {marker && (
                <p className="text-sm text-muted-foreground text-center">
                    Coordenadas seleccionadas: {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
                </p>
            )}
        </div>
    );
}
