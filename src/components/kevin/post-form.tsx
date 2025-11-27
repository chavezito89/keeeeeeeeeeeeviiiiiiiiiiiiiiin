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
import dynamic from 'next/dynamic';
import imageCompression from 'browser-image-compression';

const LocationPicker = dynamic(() => import('./location-picker').then(mod => mod.LocationPicker), {
  ssr: false,
  loading: () => <div className="h-80 w-full rounded-md bg-muted flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
});


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

interface PostFormProps {
    mapboxToken?: string;
}

export function PostForm({ mapboxToken }: PostFormProps) {
    const { toast } = useToast();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [compressedFile, setCompressedFile] = useState<File | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setPreviewImage(null);
            setCompressedFile(null);
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            toast({
                variant: "destructive",
                title: "Imagen demasiado grande",
                description: "Por favor, selecciona una imagen de menos de 5 MB.",
            });
            // Clear the file input
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setPreviewImage(null);
            setCompressedFile(null);
            return;
        }

        setPreviewImage(URL.createObjectURL(file));

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };

        try {
            const compressed = await imageCompression(file, options);
            setCompressedFile(compressed);
        } catch (error) {
            console.error("Error compressing image:", error);
            toast({
                variant: "destructive",
                title: "Error de compresión",
                description: "No se pudo procesar la imagen. Inténtalo de nuevo.",
            });
            setPreviewImage(null);
            setCompressedFile(null);
        }
    }

    const handleFormAction = async (formData: FormData) => {
        const lat = formData.get('latitude');
        const lon = formData.get('longitude');

        if (!lat || !lon) {
             toast({
                variant: "destructive",
                title: "Ubicación requerida",
                description: "Por favor, selecciona una ubicación en el mapa.",
            });
            return;
        }

        if (compressedFile) {
            formData.set('image', compressedFile, compressedFile.name);
        } else {
             toast({
                variant: "destructive",
                title: "Imagen requerida",
                description: "Por favor, selecciona una imagen.",
            });
            return;
        }

        const result = await createPost(formData);
        if (result?.success) {
            toast({
                title: "¡Éxito!",
                description: result.message,
            });
            formRef.current?.reset();
            setPreviewImage(null);
            setCompressedFile(null);
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            window.dispatchEvent(new Event('resetMap'));

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
                        <Input id="image" name="image" type="file" accept="image/*" required onChange={handleImageChange} ref={fileInputRef} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="comment" className="flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Comentario (opcional)</Label>
                        <Textarea id="comment" name="comment" placeholder="¿Qué estás haciendo?" />
                    </div>

                    <LocationPicker mapboxToken={mapboxToken} />

                    <input type="hidden" name="latitude" />
                    <input type="hidden" name="longitude" />
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    );
}
