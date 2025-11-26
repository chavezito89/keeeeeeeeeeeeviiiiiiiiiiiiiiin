
"use client";

import { useEffect, useRef, useState } from 'react';
import L, { LatLngExpression, Icon, Map } from 'leaflet';
import { Label } from '@/components/ui/label';
import { Loader2, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const customIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
});

export function LocationPicker() {
    const { toast } = useToast();
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    
    const mapRef = useRef<Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [selectedCoords, setSelectedCoords] = useState<string>("");

    const updateHiddenInputs = (lat: number | null, lng: number | null) => {
        const latInput = document.querySelector('input[name="latitude"]') as HTMLInputElement;
        const lonInput = document.querySelector('input[name="longitude"]') as HTMLInputElement;
        if (latInput && lonInput) {
            latInput.value = lat?.toString() || '';
            lonInput.value = lng?.toString() || '';
        }
        if (lat && lng) {
            setSelectedCoords(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } else {
            setSelectedCoords("");
        }
    };

    const handleMapClick = (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        if (mapRef.current) {
            if (markerRef.current) {
                markerRef.current.setLatLng(e.latlng);
            } else {
                markerRef.current = L.marker(e.latlng, { icon: customIcon }).addTo(mapRef.current);
            }
        }
        updateHiddenInputs(lat, lng);
    };

    const centerOnUserLocation = () => {
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
                const newPosition: LatLngExpression = [latitude, longitude];
                
                if (mapRef.current) {
                    mapRef.current.setView(newPosition, 13);
                     if (markerRef.current) {
                        markerRef.current.setLatLng(newPosition);
                    } else {
                        markerRef.current = L.marker(newPosition, { icon: customIcon }).addTo(mapRef.current);
                    }
                }
                updateHiddenInputs(latitude, longitude);
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
    };

    const handleReset = () => {
         if (mapRef.current) {
            mapRef.current.setView([20, 0], 2);
            if (markerRef.current) {
                markerRef.current.remove();
                markerRef.current = null;
            }
         }
         updateHiddenInputs(null, null);
    }
    
    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current, {
            center: [20, 0],
            zoom: 2,
            scrollWheelZoom: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        map.on('click', handleMapClick);

        mapRef.current = map;
        
        centerOnUserLocation(); // Intentar obtener ubicación al inicio

        window.addEventListener('resetMap', handleReset);

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
            window.removeEventListener('resetMap', handleReset);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="space-y-2">
            <Label className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Ubicación del avistamiento</Label>
            <p className="text-sm text-muted-foreground">Haz clic en el mapa para marcar el punto exacto.</p>
            <div className="relative">
                <div ref={containerRef} className="h-64 w-full rounded-md overflow-hidden border bg-muted" tabIndex={-1} />
            </div>
            {isGettingLocation && (
                <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Obteniendo ubicación...
                </p>
            )}
            {selectedCoords && !isGettingLocation && (
                <p className="text-sm text-muted-foreground text-center">
                    Coordenadas seleccionadas: {selectedCoords}
                </p>
            )}
        </div>
    );
}
