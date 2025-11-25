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
                    Logging Sighting...
                </>
            ) : "Log My Sighting"}
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
                title: "Location Missing",
                description: "Please select a location on the map.",
            });
            return;
        }

        formData.set('latitude', location.lat.toString());
        formData.set('longitude', location.lon.toString());

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
