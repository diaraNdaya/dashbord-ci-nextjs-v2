# Guide de résolution des problèmes d'hydratation

## Problème identifié

L'erreur d'hydratation était causée par l'utilisation de `new Date().toLocaleDateString()` dans les composants React. Le serveur et le client peuvent avoir des formats de date différents selon la locale, causant une incompatibilité d'hydratation.

## Solutions implémentées

### 1. Utilitaires de formatage de date (`src/lib/utils/date.ts`)

Fonctions utilitaires pour formater les dates de manière cohérente :

- `formatDate(dateString)` - Format DD/MM/YYYY
- `formatDateTime(dateString)` - Format DD/MM/YYYY à HH:MM
- `formatRelativeDate(dateString)` - Format relatif (il y a X jours)

### 2. Composant DateDisplay (`src/components/atoms/DateDisplay.tsx`)

Composant React qui gère l'hydratation de manière sûre :

```tsx
<DateDisplay date={banner.createdAt} format="date" />
<DateDisplay date={banner.createdAt} format="datetime" />
<DateDisplay date={banner.createdAt} format="relative" />
```

**Avantages :**

- Évite les problèmes d'hydratation
- Affiche un placeholder pendant l'hydratation
- Format cohérent entre serveur et client
- Tooltip avec date/heure complète

### 3. Composants mis à jour

- ✅ `BannerTableRow` - Utilise `DateDisplay`
- ✅ `BannerViewDialog` - Utilise `DateDisplay`

## Comment corriger d'autres composants

### Avant (problématique)

```tsx
{
  new Date(item.createdAt).toLocaleDateString();
}
{
  new Date(item.createdAt).toLocaleDateString("fr-FR");
}
```

### Après (solution 1 - Utilitaire)

```tsx
import { formatDate } from "@/lib/utils/date";

{
  formatDate(item.createdAt);
}
```

### Après (solution 2 - Composant)

```tsx
import { DateDisplay } from "@/components/atoms/DateDisplay";

<DateDisplay date={item.createdAt} />
<DateDisplay date={item.createdAt} format="datetime" />
<DateDisplay date={item.createdAt} format="relative" />
```

## Autres composants à corriger

Les composants suivants utilisent encore `toLocaleDateString()` et devraient être mis à jour :

1. `src/components/molecules/UsersDataTable.tsx`
2. `src/components/templates/documents.template.tsx`
3. `src/components/molecules/SubcategoryTableRow.tsx`
4. `src/components/templates/profile.template.tsx`
5. `src/components/molecules/TransactionsDataTable.tsx`
6. `src/components/templates/config-commissions.template.tsx`
7. `src/components/organisms/SubcategoryViewDialog.tsx`
8. `src/components/organisms/TransactionsTable.tsx`
9. `src/components/organisms/CategoryViewDialog.tsx`
10. `src/components/molecules/OrdersDataTable.tsx`
11. `src/components/molecules/CategoryTableRow.tsx`
12. `src/components/atoms/OrderTrackingStep.tsx`

## Recommandations

1. **Utiliser `DateDisplay`** pour les nouvelles fonctionnalités
2. **Migrer progressivement** les composants existants
3. **Tester l'hydratation** en désactivant JavaScript dans le navigateur
4. **Éviter `Date.now()`** et `Math.random()` dans les composants SSR
5. **Utiliser des valeurs déterministes** pour le rendu initial

## Test d'hydratation

Pour tester si un composant cause des problèmes d'hydratation :

1. Ouvrir les DevTools
2. Aller dans l'onglet Console
3. Rafraîchir la page
4. Chercher les erreurs "Hydration failed"

## Bonnes pratiques

- ✅ Utiliser `DateDisplay` ou `formatDate()`
- ✅ Valeurs déterministes pour le rendu initial
- ✅ `useEffect` pour les valeurs dynamiques côté client
- ❌ `new Date().toLocaleDateString()` directement dans JSX
- ❌ `Date.now()` ou `Math.random()` dans le rendu
- ❌ Conditions basées sur `typeof window`
