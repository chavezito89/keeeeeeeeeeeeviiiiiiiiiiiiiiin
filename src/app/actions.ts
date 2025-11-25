"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addPost, uploadPostImage } from "@/lib/supabase/queries";

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
    
    try {
        const imageUrl = await uploadPostImage(validatedFields.data.image);

        await addPost({
            image_url: imageUrl,
            comment: validatedFields.data.comment || null,
            latitude: validatedFields.data.latitude,
            longitude: validatedFields.data.longitude,
        });

        revalidatePath("/feed");
        return { success: true, message: "New sighting logged!" };

    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        return {
            success: false,
            message: `Failed to log sighting: ${message}`
        }
    }
}
