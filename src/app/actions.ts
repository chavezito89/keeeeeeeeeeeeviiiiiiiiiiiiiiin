"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addPost, uploadPostImage, addComment } from "@/lib/supabase/queries";

const postSchema = z.object({
    comment: z.string().max(500, "El comentario es demasiado largo.").optional(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    image: z.instanceof(File).refine(file => file.size > 0, "Se requiere una imagen."),
});

const commentSchema = z.object({
    postId: z.string(),
    username: z.string(),
    comment: z.string().min(1, "El comentario no puede estar vacío.").max(500, "El comentario es demasiado largo."),
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
        return { success: true, message: "¡Nuevo avistamiento registrado!" };

    } catch (error) {
        const message = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
        return {
            success: false,
            message: `No se pudo registrar el avistamiento: ${message}`
        }
    }
}

export async function createComment(formData: FormData) {
    const validatedFields = commentSchema.safeParse({
        postId: formData.get('postId'),
        username: formData.get('username'),
        comment: formData.get('comment'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await addComment({
            post_id: validatedFields.data.postId,
            username: validatedFields.data.username,
            comment: validatedFields.data.comment,
        });

        revalidatePath(`/feed`); // Could be more specific if we had post pages
        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
        return {
            success: false,
            message: `No se pudo agregar el comentario: ${message}`
        }
    }
}
