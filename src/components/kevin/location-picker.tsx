"use client";

import { useState, useEffect, memo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const customIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
});

function MapContent({ onLocationChange }: { onLocationChange: (location: { lat: number, lon: number }) => void }) {
    const map = useMap();
    
    useMapEvents({
        click(e) {
            onLocationChange({ lat: e.latlng.lat, lon: e.latlng.lng });
        },
    });

    useEffect(() => {
        const handleReset = () => {
             map.setView([20, 0], 2);
             onLocationChange({ lat: 0, lon: 0 }); // This will clear the marker via state
        }
        window.addEventListener('resetMap', handleReset);
        return () => window.removeEventListener('resetMap', handleReset);
    }, [map, onLocationChange]);

    return null;
}

export function LocationPicker() {
    const { toast } = useToast();
    const [isGettingLocation, setIsGettingLocation] = useState(true);
    const [map, setMap] = useState<L.Map | null>(null);
    const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null);

    const updateHiddenInputs = (lat: number, lon: number) => {
        const latInput = document.querySelector('input[name="latitude"]') as HTMLInputElement;
        const lonInput = document.querySelector('input[name="longitude"]') as HTMLInputElement;
        if (latInput && lonInput) {
            latInput.value = lat.toString();
            lonInput.value = lon.toString();
        }
    };
    
    const handleLocationChange = (newLoc: { lat: number; lon: number; }) => {
        setMarkerPosition([newLoc.lat, newLoc.lon]);
        updateHiddenInputs(newLoc.lat, newLoc.lon);
        if (map) {
            map.setView([newLoc.lat, newLoc.lon], map.getZoom());
        }
    };
    
    const handleGetLocation = () => {
        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                };
                if (map) {
                    map.setView([newLocation.lat, newLocation.lon], 13);
                }
                setMarkerPosition([newLocation.lat, newLocation.lon]);
                updateHiddenInputs(newLocation.lat, newLocation.lon);
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
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    useEffect(() => {
        handleGetLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]);

    useEffect(() => {
        const handleReset = () => {
            setMarkerPosition(null);
            updateHiddenInputs(0, 0);
        };
        window.addEventListener('resetMap', handleReset);
        return () => window.removeEventListener('resetMap', handleReset);
    }, []);

    return (
        <div className="space-y-2">
            <Label className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Ubicación</Label>
            <div className="h-64 w-full rounded-md overflow-hidden border">
                <MapContainer ref={setMap} center={[20, 0]} zoom={2} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {markerPosition && <Marker position={markerPosition} icon={customIcon}></Marker>}
                    <MapContent onLocationChange={handleLocationChange} />
                </MapContainer>
            </div>
            <Button
                type="button"
                variant="outline"
                onClick={handleGetLocation}
                disabled={isGettingLocation || !map}
                className="w-full"
            >
                {isGettingLocation && <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Obteniendo ubicación...</>}
                {!isGettingLocation && "Usar mi ubicación actual"}
            </Button>
            {markerPosition && Array.isArray(markerPosition) && (
                <p className="text-sm text-muted-foreground text-center">
                    Seleccionado: {markerPosition[0].toFixed(4)}, {markerPosition[1].toFixed(4)}
                </p>
            )}
        </div>
    );
}
