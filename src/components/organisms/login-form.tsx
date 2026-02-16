"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { LoginSchema, LoginType } from "@/lib/schemas/login.schema";
import { cn } from "@/lib/utils";
import { loginAction } from "@/services/server/auth.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Spinner } from "../ui/spinner";

// ✅ helper: applique l'erreur API dans react-hook-form
function applyApiErrorsToForm(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiError: { message?: string; errors?: any },
  setError: ReturnType<typeof useForm<LoginType>>["setError"],
) {
  // message global
  if (apiError?.message) {
    setError("root", { type: "server", message: apiError.message });
  }

  const e = apiError?.errors;

  // format 1: { username: "...", password: "..." }
  if (e && typeof e === "object" && !Array.isArray(e)) {
    if (typeof e.username === "string") {
      setError("username", { type: "server", message: e.username });
    }
    if (typeof e.password === "string") {
      setError("password", { type: "server", message: e.password });
    }
  }

  // format 2: [{ field: "username", message: "..." }, ...]
  if (Array.isArray(e)) {
    for (const item of e) {
      const field = item?.field;
      const message = item?.message;
      if (field === "username" && message) {
        setError("username", { type: "server", message });
      }
      if (field === "password" && message) {
        setError("password", { type: "server", message });
      }
    }
  }
}

export function LoginForm({ className }: React.ComponentProps<"div">) {
  const router = useRouter();

  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema()),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const login = useMutation({
    mutationFn: loginAction,
    onSuccess: (result) => {
      console.log("Root", result);

      if (!result?.success) {
        // En cas d'erreur, ne pas vider les champs
        applyApiErrorsToForm(
          result?.error ?? { message: "Erreur de connexion" },
          form.setError,
        );
        return;
      }

      // Seulement en cas de succès, vider les champs et rediriger
      form.reset();
      router.push("/dashboard");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      form.setError("root", {
        type: "server",
        message: err?.message || "Erreur inattendue",
      });
    },
  });

  const onSubmit = (values: LoginType) => {
    if (login.isPending) return;
    login.mutate(values);
  };

  const rootError = form.formState.errors.root?.message;

  useEffect(() => {
    if (rootError) {
      const timer = setTimeout(() => {
        form.clearErrors("root");
      }, 5000); // 5 secondes

      return () => clearTimeout(timer);
    }
  }, [rootError, form]);

  return (
    <motion.div
      className={cn("flex flex-col gap-6", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-minigap">
                Bienvenue sur le Tableau de bord NDAYA
              </CardTitle>
              <CardDescription>
                Connectez-vous pour gérer vos produits, commandes et paiements.
              </CardDescription>
            </CardHeader>
          </motion.div>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FieldGroup>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <Field>
                    <FieldLabel htmlFor="username">
                      Nom d'utilisateur
                    </FieldLabel>
                    <Input
                      id="username"
                      type="text"
                      placeholder="ex. nom@ndaya.com"
                      autoComplete="username"
                      {...form.register("username")}
                    />
                    {form.formState.errors.username?.message ? (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.username.message}
                      </p>
                    ) : null}
                  </Field>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                      <Link
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Mot de passe oublié ?
                      </Link>
                    </div>
                    <PasswordInput
                      id="password"
                      placeholder="Entrez votre mot de passe"
                      autoComplete="current-password"
                      {...form.register("password")}
                    />
                    {form.formState.errors.password?.message ? (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.password.message}
                      </p>
                    ) : null}
                  </Field>
                </motion.div>

                {rootError ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  >
                    {rootError}
                  </motion.div>
                ) : null}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <Field>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className="w-full bg-violet-vif hover:bg-violet-vif/90"
                        type="submit"
                        disabled={login.isPending}
                      >
                        {login.isPending ? <Spinner /> : "Se connecter"}
                      </Button>
                    </motion.div>

                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      Connexion sécurisée • Vos données sont protégées.
                    </p>
                  </Field>
                </motion.div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
