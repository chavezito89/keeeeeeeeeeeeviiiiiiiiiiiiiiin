"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addPost } from "@/lib/supabase/queries";

const postSchema = z.object({
    comment: z.string().max(500, "Comment is too long.").optional(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    image: z.instanceof(File).refine(file => file.size > 0, "Image is required."),
});

export async function createPost(formData: FormData) {
    const validatedFields = postSchema.safeParse({
        comment: formData.get('comment'),
        latitude: formData.get('latitude'),
        longitude: formData.get('longitude'),
        image: formData.get('image'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    // In a real app, you'd upload the image to Supabase Storage
    // and save the URL in your database.
    // For this mock, we'll just log it.
    
    try {
        await addPost({
            // For mock purposes, we'll pass a placeholder URL.
            // In a real app, this would be the URL from Supabase Storage.
            imageUrl: URL.createObjectURL(validatedFields.data.image), 
            comment: validatedFields.data.comment || null,
            latitude: validatedFields.data.latitude,
            longitude: validatedFields.data.longitude,
        });

        revalidatePath("/feed");
        return { success: true, message: "New sighting logged!" };

    } catch (error) {
        return {
            success: false,
            message: "Failed to log sighting. Please try again."
        }
    }
}
