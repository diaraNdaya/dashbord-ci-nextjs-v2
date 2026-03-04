"use client";

import { PageHeader } from "@/components/molecules/PageHeader";
import { toastErr, toastSuccess } from "@/components/molecules/ToastCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  pushNotificationSchema,
  type PushNotificationFormData,
} from "@/lib/schemas/push.schema";
import type {
  CreatePushNotificationCredential,
  PushNotificationApiResponse,
} from "@/lib/types/push.types";
import { sendPushNotificationMutationOptions } from "@/services/queries/push.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail01Icon, Notification01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function PushTemplate() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PushNotificationFormData>({
    resolver: zodResolver(pushNotificationSchema),
    defaultValues: {
      title: "",
      body: "",
      imageUrl: "",
    },
  });

  const sendPushMutation = useMutation({
    ...sendPushNotificationMutationOptions(),
    onSuccess: (data: PushNotificationApiResponse) => {
      if (data.status === 200) {
        toastSuccess("Notification push envoyée avec succès");
        form.reset();
      } else {
        toastErr("Erreur lors de l'envoi de la notification push");
      }
      setIsLoading(false);
    },
    onError: () => {
      toastErr("Erreur lors de l'envoi de la notification push");
      setIsLoading(false);
    },
  });

  const onSubmit = async (values: PushNotificationFormData) => {
    setIsLoading(true);
    const pushData: CreatePushNotificationCredential = {
      title: values.title.trim(),
      body: values.body.trim(),
      imageUrl: values.imageUrl?.trim() || "",
    };
    sendPushMutation.mutate(pushData);
  };

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="@container/main flex flex-1 flex-col gap-4">
        {/* Header */}
        <PageHeader
          icon={Notification01Icon}
          title="Notifications Push"
          description="Envoyer des notifications push à tous les utilisateurs"
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Mail01Icon}
                strokeWidth={2}
                className="h-5 w-5"
              />
              Envoyer une notification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Field>
                  <FieldLabel>Titre de la notification *</FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="Ex: Ndaya ci"
                      {...form.register("title")}
                      disabled={isLoading}
                    />
                  </FieldContent>
                  <FieldError>
                    {form.formState.errors.title?.message}
                  </FieldError>
                </Field>

                {/* URL de l'image (optionnel) */}
                <Field>
                  <FieldLabel>URL de l&apos;image (optionnel)</FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...form.register("imageUrl")}
                      disabled={isLoading}
                    />
                  </FieldContent>
                  <FieldError>
                    {form.formState.errors.imageUrl?.message}
                  </FieldError>
                </Field>
              </div>

              {/* Message */}
              <Field>
                <FieldLabel>Message de la notification *</FieldLabel>
                <FieldContent>
                  <Textarea
                    placeholder="Ex: Nouvelle version disponible"
                    className="min-h-[120px]"
                    {...form.register("body")}
                    disabled={isLoading}
                  />
                </FieldContent>
                <FieldError>{form.formState.errors.body?.message}</FieldError>
              </Field>

              {/* Aperçu */}
              {(form.watch("title") || form.watch("body")) && (
                <div className="space-y-2">
                  <h4 className="font-medium">Aperçu de la notification</h4>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <HugeiconsIcon
                              icon={Notification01Icon}
                              strokeWidth={2}
                              className="h-4 w-4 text-primary-foreground"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm">
                            {form.watch("title") || "Titre de la notification"}
                          </h5>
                          <p className="text-sm text-muted-foreground mt-1">
                            {form.watch("body") || "Message de la notification"}
                          </p>
                          {form.watch("imageUrl") && (
                            <div className="mt-2">
                              <img
                                src={form.watch("imageUrl")}
                                alt="Aperçu"
                                className="max-w-full h-auto max-h-32 rounded border"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Bouton d'envoi */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || sendPushMutation.isPending}
                  className="min-w-[150px] bg-violet-vif hover:bg-violet-vif/80"
                >
                  {isLoading || sendPushMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Envoi en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={Mail01Icon}
                        strokeWidth={2}
                        className="h-4 w-4"
                      />
                      Envoyer la notification
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informations */}
        <Card>
          <CardHeader>
            <CardTitle>Informations importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  La notification sera envoyée à tous les utilisateurs ayant
                  activé les notifications push
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Le titre ne peut pas dépasser 100 caractères et le message 500
                  caractères
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  L&apos;URL de l&apos;image est optionnelle. Si fournie, elle
                  doit être une URL valide
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Une fois envoyée, la notification ne peut pas être annulée
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
