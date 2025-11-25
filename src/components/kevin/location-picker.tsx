"use client";

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationPickerProps {
    location: { lat: number, lon: number } | null;
    onLocationChange: (location: { lat: number, lon: number } | null) => void;
}

const customIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
});

function MapEvents({ onLocationChange }: { onLocationChange: (location: { lat: number, lon: number }) => void }) {
    useMapEvents({
        click(e) {
            onLocationChange({ lat: e.latlng.lat, lon: e.latlng.lng });
        },
    });
    return null;
}

export function LocationPicker({ location, onLocationChange }: LocationPickerProps) {
    const { toast } = useToast();
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [mapCenter, setMapCenter] = useState<LatLngExpression>([51.505, -0.09]);
    
    const handleGetLocation = () => {
        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                };
                onLocationChange(newLocation);
                setMapCenter([newLocation.lat, newLocation.lon]);
                setIsGettingLocation(false);
            },
            (error) => {
                setIsGettingLocation(false);
                toast({
                    variant: "destructive",
                    title: "Location Error",
                    description: "Could not get location. Please enable location services in your browser.",
                });
            }
        );
    };

    const position = location ? [location.lat, location.lon] as LatLngExpression : null;

    return (
        <div className="space-y-2">
            <Label className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Location</Label>
            <div className="h-64 w-full rounded-md overflow-hidden border">
                <MapContainer center={mapCenter} zoom={location ? 13 : 3} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }} whenCreated={(map) => {
                    if (location) {
                        map.setView([location.lat, location.lon], 13);
                    }
                }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {position && <Marker position={position} icon={customIcon}></Marker>}
                    <MapEvents onLocationChange={onLocationChange} />
                </MapContainer>
            </div>
            <Button
                type="button"
                variant="outline"
                onClick={handleGetLocation}
                disabled={isGettingLocation}
                className="w-full"
            >
                {isGettingLocation && <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Getting Current Location...</>}
                {!isGettingLocation && "Use My Current Location"}
            </Button>
            {location && (
                <p className="text-sm text-muted-foreground text-center">
                    Selected: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                </p>
            )}
        </div>
    );
}
