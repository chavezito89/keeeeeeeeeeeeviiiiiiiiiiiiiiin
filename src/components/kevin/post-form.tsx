"use client";

import { useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { createPost } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { LocationPicker } from './location-picker';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando avistamiento...
                </>
            ) : "Registrar mi avistamiento"}
        </Button>
    )
}


export function PostForm() {
    const { toast } = useToast();
    const [location, setLocation] = useState<{ lat: number, lon: number } | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setPreviewImage(null);
        }
    }

    const handleFormAction = async (formData: FormData) => {
        if (!location) {
             toast({
                variant: "destructive",
                title: "Ubicación requerida",
                description: "Por favor, selecciona una ubicación en el mapa.",
            });
            return;
        }

        formData.set('latitude', location.lat.toString());
        formData.set('longitude', location.lon.toString());

        const result = await createPost(formData);
        if (result?.success) {
            toast({
                title: "¡Éxito!",
                description: result.message,
            });
            formRef.current?.reset();
            setPreviewImage(null);
            setLocation(null);
        } else if (result?.errors) {
            const errorMessages = Object.values(result.errors).flat().join('\n');
            toast({
                variant: "destructive",
                title: "Error de validación",
                description: errorMessages || "Por favor revisa los datos.",
            });
        } else {
             toast({
                variant: "destructive",
                title: "¡Uy! Algo salió mal.",
                description: result?.message || "Hubo un problema con tu solicitud.",
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Registrar un Nuevo Avistamiento</CardTitle>
            </CardHeader>
            <form ref={formRef} action={handleFormAction}>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="image" className="flex items-center gap-2"><ImageIcon className="h-4 w-4"/> Foto</Label>
                        {previewImage && (
                            <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                                <Image src={previewImage} alt="Previsualización de imagen" fill style={{objectFit: "cover"}}/>
                            </div>
                        )}
                        <Input id="image" name="image" type="file" accept="image/*" required onChange={handleImageChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="comment" className="flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Comentario (opcional)</Label>
                        <Textarea id="comment" name="comment" placeholder="¿Qué estás haciendo?" />
                    </div>

                    <LocationPicker
                        location={location}
                        onLocationChange={setLocation}
                    />

                    <input type="hidden" name="latitude" value={location?.lat || ''} />
                    <input type="hidden" name="longitude" value={location?.lon || ''} />
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    );
}
