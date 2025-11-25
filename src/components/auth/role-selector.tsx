"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, User, Loader2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { KEVIN_USERNAME_KEY, APP_NAME } from "@/lib/constants";

const usernameSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres").max(20, "El nombre de usuario debe tener máximo 20 caracteres"),
});

export function RoleSelector() {
  const [selection, setSelection] = useState<"kevin" | "not_kevin" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleKevinSelection = () => {
    setIsLoading(true);
    router.push("/kevin/dashboard");
  };
  
  const handleNotKevinSelection = () => {
    setSelection("not_kevin");
  };

  function onSubmit(values: z.infer<typeof usernameSchema>) {
    setIsLoading(true);
    localStorage.setItem(KEVIN_USERNAME_KEY, values.username);
    setTimeout(() => {
      router.push("/feed");
    }, 500);
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeInOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  return (
    <div className="text-center">
        <Image src="https://vxroruoskxkdlnfkkqdv.supabase.co/storage/v1/object/public/LOGO/logo%20cuadrado.png" alt="Logo de ¿Dónde está Kevin?" width={150} height={150} className="mx-auto mb-4" />
        <h1 className="text-4xl font-bold tracking-tight font-headline">{APP_NAME}</h1>
        <p className="text-muted-foreground mt-2 mb-8">¿Pero dónde se metió? Únete a la búsqueda.</p>
      
      <AnimatePresence mode="wait">
        {!selection && (
          <motion.div
            key="selection"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Card className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform duration-300" onClick={handleNotKevinSelection}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl"><Eye /> No soy Kevin</CardTitle>
                    <CardDescription>Únete a la caza y mira dónde ha estado Kevin.</CardDescription>
                </CardHeader>
            </Card>
            <Card className="cursor-pointer bg-primary text-primary-foreground hover:shadow-lg hover:-translate-y-1 transition-transform duration-300" onClick={handleKevinSelection}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl"><User /> Soy Kevin</CardTitle>
                    <CardDescription className="text-primary-foreground/80">Registra tus aventuras para que todos las vean.</CardDescription>
                </CardHeader>
            </Card>
          </motion.div>
        )}

        {selection === "not_kevin" && (
            <motion.div
                key="form"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Crea un Nombre de Usuario</CardTitle>
                        <CardDescription>Elige un nombre para unirte a la comunidad de buscadores de Kevin.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre de usuario</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input placeholder="ej. SuperBuscador" {...field} className="pl-10" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uniéndome...
                                        </>
                                    ) : (
                                        <>
                                            Comenzar a Buscar <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
