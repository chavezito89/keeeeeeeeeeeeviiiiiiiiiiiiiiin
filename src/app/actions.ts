"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";

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
        const imageFile = validatedFields.data.image;
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabaseServer.storage.from('posts').upload(filePath, imageFile);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw new Error('Image upload failed.');
        }

        const { data: publicUrlData } = supabaseServer.storage.from('posts').getPublicUrl(filePath);

        if (!publicUrlData) {
            throw new Error("Could not get public URL for the image.");
        }
        
        const imageUrl = publicUrlData.publicUrl;


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
        const { error } = await supabaseServer
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


        revalidatePath(`/feed`);
        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
        return {
            success: false,
            message: `No se pudo agregar el comentario: ${message}`
        }
    }
}

const likeSchema = z.object({
  postId: z.coerce.number(),
  username: z.string(),
});

export async function toggleLike(formData: FormData) {
    const validatedFields = likeSchema.safeParse({
        postId: formData.get('postId'),
        username: formData.get('username'),
    });
    
    if (!validatedFields.success) {
        return { error: 'Invalid input' };
    }
    
    const { postId, username } = validatedFields.data;

    // Check if the like exists
    const { data: existingLike, error: selectError } = await supabaseServer
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('username', username)
        .single();
    
    if (selectError && selectError.code !== 'PGRST116') { // Ignore "exact one row" error
        console.error('Error checking for like:', selectError);
        return { error: "Database error when checking for like." };
    }

    try {
        if (existingLike) {
            // User has liked it, so unlike it
            const { error: deleteError } = await supabaseServer
                .from('post_likes')
                .delete()
                .eq('id', existingLike.id);
            if (deleteError) throw deleteError;
        } else {
            // User has not liked it, so like it
            const { error: insertError } = await supabaseServer
                .from('post_likes')
                .insert({ post_id: postId, username });
            if (insertError) throw insertError;
        }
        revalidatePath('/feed');
        return { success: true };

    } catch (error) {
        console.error("Error toggling like:", error);
        return { error: "Could not update like status." };
    }
}
