# Documentation des Queries

## 📁 Structure des fichiers queries

```
src/services/queries/
├── index.ts              # Export centralisé
├── auth.queries.ts       # Queries d'authentification
├── user.queries.ts       # Queries utilisateurs
├── products.queries.ts   # Queries produits
├── categories.queries.ts # Queries catégories
├── orders.queries.ts     # Queries commandes
└── documents.queries.ts  # Queries documents
```

## 🔄 Pattern des Queries

Chaque fichier de queries suit le même pattern :

### Query Options (pour useQuery)

```typescript
export const fetchDataQueryOptions = (params) => ({
  queryKey: ["resource", ...params] as const,
  queryFn: async () => {
    const result = await fetchDataAction(params);
    if (result.success) {
      return result.data;
    }
    throw new Error(result.error.message || "Message d'erreur par défaut");
  },
});
```

### Mutation Options (pour useMutation)

```typescript
export const createDataMutationOptions = () => ({
  mutationFn: createDataAction,
});
```

## 📋 Queries disponibles par module

### 🔐 Auth Queries (`auth.queries.ts`)

- `meQueryOptions()` - Récupère le profil utilisateur
- `loginMutationOptions()` - Connexion
- `logoutMutationOptions()` - Déconnexion

### 👥 User Queries (`user.queries.ts`)

**Queries :**

- `fetchUsersQueryOptions(page, limit, searchParams?)` - Liste des clients
- `fetchSellersQueryOptions(page, limit, searchParams?)` - Liste des vendeurs
- `fetchTopSellersQueryOptions()` - Top vendeurs
- `fetchUsersBlockedQueryOptions(page, limit)` - Utilisateurs bloqués
- `getAllDocumentsQueryOptions(page, limit)` - Documents
- `getAllVerifiedSellersQueryOptions(page, limit, statut)` - Vendeurs vérifiés
- `getAllVerifiedCustomersQueryOptions(page, limit, statut)` - Clients vérifiés

**Mutations :**

- `blockUserMutationOptions()` - Bloquer un utilisateur
- `validateDocumentMutationOptions()` - Valider un document

### 🛍️ Products Queries (`products.queries.ts`)

**Queries :**

- `getAllProductsQueryOptions(page, limit)` - Tous les produits
- `getTopProductsQueryOptions()` - Produits populaires
- `getProductBySellerQueryOptions(params)` - Produits par vendeur
- `getOneProductQueryOptions(id)` - Un produit spécifique

**Mutations :**

- `deleteProductMutationOptions()` - Supprimer un produit

### 🏷️ Categories Queries (`categories.queries.ts`)

**Queries :**

- `getAllCategoriesQueryOptions(page, limit)` - Toutes les catégories
- `getAllSubCategoriesQueryOptions(page, limit, searchParams?)` - Sous-catégories

**Mutations :**

- `createCategoryMutationOptions()` - Créer une catégorie
- `updateCategoryMutationOptions()` - Mettre à jour une catégorie
- `deleteCategoryMutationOptions()` - Supprimer une catégorie
- `createSubCategoryMutationOptions()` - Créer une sous-catégorie
- `updateSubCategoryMutationOptions()` - Mettre à jour une sous-catégorie
- `deleteSubCategoryMutationOptions()` - Supprimer une sous-catégorie
- `uploadFileMutationOptions()` - Upload de fichiers

### 📦 Orders Queries (`orders.queries.ts`)

**Queries :**

- `fetchOrdersQueryOptions(page, limit)` - Liste des commandes

### 📄 Documents Queries (`documents.queries.ts`)

**Queries :**

- `getAllDocumentsQueryOptions(page, limit)` - Tous les documents
- `getAllVerifiedSellersQueryOptions(page, limit, statut)` - Vendeurs vérifiés
- `getAllVerifiedCustomersQueryOptions(page, limit, statut)` - Clients vérifiés

**Mutations :**

- `validateDocumentMutationOptions()` - Valider un document

## 💡 Exemples d'utilisation

### Avec React Query dans un composant

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsersQueryOptions,
  blockUserMutationOptions,
  getAllProductsQueryOptions,
  createCategoryMutationOptions,
} from "@/services/queries";

function UsersPage() {
  const queryClient = useQueryClient();

  // Query pour récupérer les utilisateurs
  const { data: users, isLoading, error } = useQuery(
    fetchUsersQueryOptions(1, 10, { name: "John" })
  );

  // Mutation pour bloquer un utilisateur
  const blockUserMutation = useMutation({
    ...blockUserMutationOptions(),
    onSuccess: () => {
      // Invalider et refetch les données
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleBlockUser = (userId: string) => {
    blockUserMutation.mutate(userId);
  };

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div>
      {users?.data.map(user => (
        <div key={user.id}>
          {user.username}
          <button onClick={() => handleBlockUser(user.id)}>
            Bloquer
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Avec des paramètres de recherche

```typescript
function ProductsPage() {
  const [page, setPage] = useState(1);
  const [sellerId, setSellerId] = useState("");

  // Query avec paramètres dynamiques
  const { data: products } = useQuery(
    getProductBySellerQueryOptions({
      id: sellerId,
      page,
      limit: 10
    })
  );

  // Query conditionnelle (ne s'exécute que si sellerId existe)
  const { data: sellerProducts } = useQuery({
    ...getProductBySellerQueryOptions({ id: sellerId, page: 1, limit: 5 }),
    enabled: !!sellerId, // Ne s'exécute que si sellerId est défini
  });

  return (
    <div>
      <input
        value={sellerId}
        onChange={(e) => setSellerId(e.target.value)}
        placeholder="ID du vendeur"
      />
      {/* Affichage des produits */}
    </div>
  );
}
```

### Avec des mutations complexes

```typescript
function CategoryForm() {
  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation({
    ...createCategoryMutationOptions(),
    onSuccess: (data) => {
      // Invalider les queries liées aux catégories
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      // Optionnel : ajouter la nouvelle catégorie au cache
      queryClient.setQueryData(["categories", 1, 10], (oldData: any) => ({
        ...oldData,
        data: [data.data, ...oldData.data],
      }));
    },
    onError: (error) => {
      console.error("Erreur lors de la création:", error);
    },
  });

  const handleSubmit = (formData: CategoryCredentials) => {
    createCategoryMutation.mutate(formData);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleSubmit({
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        url: formData.get("url") as string,
        images: [],
      });
    }}>
      {/* Champs du formulaire */}
      <button
        type="submit"
        disabled={createCategoryMutation.isPending}
      >
        {createCategoryMutation.isPending ? "Création..." : "Créer"}
      </button>
    </form>
  );
}
```

## ✅ Avantages de cette approche

1. **Cohérence** : Même pattern pour toutes les queries
2. **Type Safety** : Types TypeScript stricts
3. **Gestion d'erreur** : Standardisée dans chaque query
4. **Cache** : Clés de cache optimisées avec React Query
5. **Réutilisabilité** : Queries réutilisables dans tout le projet
6. **Maintenance** : Centralisé et facile à maintenir

## 🔧 Bonnes pratiques

1. **Query Keys** : Utilisez des clés descriptives et hiérarchiques
2. **Error Handling** : Gérez les erreurs de manière cohérente
3. **Loading States** : Utilisez `isLoading`, `isPending` pour l'UX
4. **Cache Invalidation** : Invalidez le cache après les mutations
5. **Conditional Queries** : Utilisez `enabled` pour les queries conditionnelles
