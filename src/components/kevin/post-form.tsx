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
import { Loader2, MapPin, Check, Image as ImageIcon, MessageSquare } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging Sighting...
                </>
            ) : "Log My Sighting"}
        </Button>
    )
}


export function PostForm() {
    const { toast } = useToast();
    const [location, setLocation] = useState<{ lat: number, lon: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleGetLocation = () => {
        setIsGettingLocation(true);
        setLocationError(null);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                setIsGettingLocation(false);
            },
            (error) => {
                setLocationError("Could not get location. Please enable location services.");
                setIsGettingLocation(false);
                toast({
                    variant: "destructive",
                    title: "Location Error",
                    description: "Could not get location. Please enable location services in your browser.",
                })
            }
        );
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setPreviewImage(null);
        }
    }

    const handleFormAction = async (formData: FormData) => {
        const result = await createPost(formData);
        if (result?.success) {
            toast({
                title: "Success!",
                description: result.message,
            });
            formRef.current?.reset();
            setPreviewImage(null);
            setLocation(null);
        } else if (result?.errors) {
            const errorMessages = Object.values(result.errors).flat().join('\n');
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: errorMessages || "Please check your input.",
            });
        } else {
             toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: result?.message || "There was a problem with your request.",
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Log a New Sighting</CardTitle>
            </CardHeader>
            <form ref={formRef} action={handleFormAction}>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="image" className="flex items-center gap-2"><ImageIcon className="h-4 w-4"/> Photo</Label>
                        {previewImage && (
                            <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                                <Image src={previewImage} alt="Image preview" fill style={{objectFit: "cover"}}/>
                            </div>
                        )}
                        <Input id="image" name="image" type="file" accept="image/*" required onChange={handleImageChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="comment" className="flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Comment (optional)</Label>
                        <Textarea id="comment" name="comment" placeholder="What are you up to?" />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Location</Label>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGetLocation}
                            disabled={isGettingLocation || !!location}
                            className="w-full"
                        >
                            {isGettingLocation && <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Getting Location...</>}
                            {location && <><Check className="mr-2 h-4 w-4 text-green-500" /> Location Acquired</>}
                            {!isGettingLocation && !location && "Get My Current Location"}
                        </Button>
                        {locationError && <p className="text-sm text-destructive">{locationError}</p>}
                        <input type="hidden" name="latitude" value={location?.lat || ''} />
                        <input type="hidden" name="longitude" value={location?.lon || ''} />
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    );
}
