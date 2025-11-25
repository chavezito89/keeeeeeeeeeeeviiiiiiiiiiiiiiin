"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addComment } from "@/lib/supabase/queries";
import { supabaseServer } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";


const postSchema = z.object({
    comment: z.string().max(500, "El comentario es demasiado largo.").optional(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    image: z.instanceof(File).refine(file => file.size > 0, "Se requiere una imagen."),
});

const commentSchema = z.object({
    postId: z.coerce.number(),
    username: z.string(),
    comment: z.string().min(1, "El comentario no puede estar vacío.").max(500, "El comentario es demasiado largo."),
});

async function uploadPostImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabaseServer.storage.from('posts').upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error('Image upload failed.');
    }

    const { data } = supabase.storage.from('posts').getPublicUrl(filePath);

    return data.publicUrl;
}

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

        const { error } = await supabaseServer
            .from('posts')
            .insert([
                { 
                    image_url: imageUrl,
                    comment: validatedFields.data.comment || null,
                    latitude: validatedFields.data.latitude,
                    longitude: validatedFields.data.longitude,
                }
            ]);

        if (error) {
            console.error("Error adding post:", error);
            throw new Error("Failed to add post to the database.");
        }

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
        const { error } = await supabase
            .from('post_comments')
            .insert([{
                post_id: validatedFields.data.postId,
                username: validatedFields.data.username,
                comment: validatedFields.data.comment,
            }]);

        if (error) {
            console.error("Error adding comment:", error);
            throw new Error("Failed to add comment to the database.");
        }


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
