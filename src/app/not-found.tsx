"use client";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-violet-vif flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative z-10 text-center text-white max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex justify-center mb-4">
            <Logo className="w-16 h-16" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="text-6xl mb-4">✦</div>
        </motion.div>

        {/* Titre principal */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold mb-4 font-minigap"
        >
          Page introuvable
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-white/90 mb-2"
        >
          Cette page n&apos;existe pas, veuillez
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-white/90 mb-8"
        >
          retourner à l&apos;accueil et réessayer.
        </motion.p>

        {/* Boutons d'action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.push("/")}
              className="bg-white text-violet-vif hover:bg-white/90 font-medium px-8 py-3 rounded-full shadow-lg"
              size="lg"
            >
              Retour à l&apos;accueil
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-medium px-8 py-3 rounded-full"
              size="lg"
            >
              Page précédente
            </Button>
          </motion.div>
        </motion.div>

        {/* Lien vers le dashboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <Link
            href="/dashboard"
            className="text-white/80 hover:text-white underline underline-offset-4 text-sm transition-colors"
          >
            Accéder au tableau de bord
          </Link>
        </motion.div>
      </div>

      {/* Code d'erreur 404 en arrière-plan - effet principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <motion.span
          className="text-[15rem] md:text-[20rem] lg:text-[25rem] font-bold text-white/20 leading-none"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          404
        </motion.span>
      </motion.div>

      {/* Effet de profondeur - 404 dupliqué */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.08, scale: 1.1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="text-[16rem] md:text-[21rem] lg:text-[26rem] font-bold text-white/10 leading-none blur-sm">
          404
        </span>
      </motion.div>
    </div>
  );
}
