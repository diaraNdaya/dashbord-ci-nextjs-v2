ARG NODE_VERSION=20.19.2-alpine
# Stage de build
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Installation des dépendances
RUN pnpm install --frozen-lockfile

# Copie du reste des fichiers du projet
COPY . .

# Construction de l'application
RUN pnpm build

# Stage de production
FROM node:${NODE_VERSION} AS runner

WORKDIR /app

# Définition des variables d'environnement pour la production
ENV NODE_ENV=production 

# Ajout d'un utilisateur non-root pour plus de sécurité
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copie des fichiers nécessaires depuis le stage de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Changement des permissions
RUN chown -R nextjs:nodejs /app

# Utilisation de l'utilisateur non-root
USER nextjs

# Exposition du port
EXPOSE 3400

# Commande pour démarrer l'application
CMD ["node", "server.js", "--hostname", "0.0.0.0"]
