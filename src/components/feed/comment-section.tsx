"use client";

import { useEffect, useState, useRef } from "react";
import { useFormStatus } from 'react-dom';
import { getComments } from "@/lib/supabase/queries";
import { createComment } from "@/app/actions";
import type { KevinComment } from "@/lib/types";
import { KEVIN_USERNAME_KEY } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="icon" disabled={pending}>
            {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : <Send className="h-4 w-4" />}
            <span className="sr-only">Enviar comentario</span>
        </Button>
    )
}

interface CommentSectionProps {
    postId: number;
    initialComments: KevinComment[];
    onCommentsUpdate: (comments: KevinComment[]) => void;
}

export function CommentSection({ postId, initialComments, onCommentsUpdate }: CommentSectionProps) {
    const [comments, setComments] = useState<KevinComment[]>(initialComments);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        const storedUsername = localStorage.getItem(KEVIN_USERNAME_KEY);
        setUsername(storedUsername);
    }, []);

    useEffect(() => {
        setComments(initialComments);
    }, [initialComments]);

    const handleFormAction = async (formData: FormData) => {
        if (!username) {
            toast({ variant: "destructive", title: "Debes iniciar sesión para comentar." });
            return;
        }

        formData.set('postId', postId.toString());
        formData.set('username', username);
        
        const newCommentText = formData.get('comment') as string;
        
        const optimisticComment: KevinComment = {
            id: Math.random(),
            post_id: postId,
            username: username,
            comment: newCommentText,
            created_at: new Date().toISOString(),
        };
        
        const newComments = [...comments, optimisticComment];
        setComments(newComments);
        onCommentsUpdate(newComments);
        formRef.current?.reset();
        
        const result = await createComment(formData);

        if (!result?.success) {
            const revertedComments = comments;
            setComments(revertedComments);
            onCommentsUpdate(revertedComments);
             toast({
                variant: "destructive",
                title: "Error",
                description: result?.message || "No se pudo publicar el comentario.",
            });
        } else {
            // Re-fetch to get the real comment from db
            const freshComments = await getComments(postId);
            setComments(freshComments);
            onCommentsUpdate(freshComments);
        }
    }

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-grow pr-4 -mr-4">
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-24">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : comments.length === 0 ? (
                        <p className="text-sm text-center text-muted-foreground py-4">
                            No hay comentarios aún. ¡Sé el primero!
                        </p>
                    ) : (
                        comments.map(comment => (
                            <div key={comment.id} className="text-sm">
                                <div className="flex items-baseline justify-between">
                                    <p className="font-bold text-primary">{comment.username}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: es })}
                                    </p>
                                </div>
                                <p className="text-foreground whitespace-pre-wrap">{comment.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
            {username && (
                <form ref={formRef} action={handleFormAction} className="mt-4 flex items-start gap-2">
                    <Textarea
                        name="comment"
                        placeholder="Escribe un comentario..."
                        className="flex-grow resize-none"
                        rows={1}
                        required
                    />
                     <input type="hidden" name="postId" value={postId} />
                    <SubmitButton />
                </form>
            )}
        </div>
    );
}
