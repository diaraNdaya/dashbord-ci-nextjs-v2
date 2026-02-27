# Architecture des Composants

Cette architecture suit le principe **Atomic Design** pour une meilleure réutilisabilité et maintenabilité.

## 🏗️ Structure

```
src/components/
├── atoms/           # Composants de base (boutons, inputs, images)
├── molecules/       # Combinaisons d'atoms (cartes, lignes de tableau)
├── organisms/       # Sections complexes (tableaux, dialogs)
└── templates/       # Pages complètes
```

## 📦 Composants Catégories

### **Molecules**

#### `CategoryStatsCards`

Affiche les statistiques des catégories (total, produits, moyenne).

```tsx
<CategoryStatsCards
  totalCategories={10}
  totalProducts={150}
  averagePerCategory={15}
/>
```

#### `CategoryTableRow`

Une ligne de tableau pour afficher une catégorie.

```tsx
<CategoryTableRow
  category={category}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
  isDeleting={false}
/>
```

#### `CategoryEmptyState`

État vide avec bouton d'action.

```tsx
<CategoryEmptyState
  onCreateClick={handleCreate}
  title="Aucune catégorie"
  description="Commencez par créer votre première catégorie"
  buttonText="Créer une catégorie"
/>
```

#### `PageHeader`

En-tête de page réutilisable avec icône, titre et bouton.

```tsx
<PageHeader
  icon={Folder01Icon}
  title="Catégories"
  description="Gérer les catégories de produits"
  buttonText="Nouvelle catégorie"
  onButtonClick={handleCreate}
  emoji="📁"
/>
```

### **Organisms**

#### `CategoryTable`

Tableau complet avec pagination et actions.

```tsx
<CategoryTable
  categories={categories}
  isLoading={isLoading}
  totalItems={totalItems}
  page={page}
  limit={limit}
  onPageChange={setPage}
  onLimitChange={setLimit}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onCreate={handleCreate}
  title="Liste des catégories"
  description="Gérer vos catégories de produits"
/>
```

#### `CategoryViewDialog`

Dialog de visualisation des détails d'une catégorie.

```tsx
<CategoryViewDialog
  category={viewingCategory}
  isOpen={!!viewingCategory}
  onClose={handleCloseView}
/>
```

## 🔄 Réutilisabilité

Ces composants peuvent être réutilisés pour :

- **Subcategories** (sous-catégories)
- **Products** (produits)
- **Users** (utilisateurs)
- **Orders** (commandes)

### Exemple : Subcategories

```tsx
// Même composants, props différentes
<PageHeader
  icon={Folder01Icon}
  title="Sous-catégories"
  description="Gérer les sous-catégories"
  buttonText="Nouvelle sous-catégorie"
  onButtonClick={handleCreate}
  emoji="📂"
/>

<CategoryTable
  categories={subcategories}
  title="Liste des sous-catégories"
  description="Gérer vos sous-catégories"
  // ... autres props
/>
```

## ✅ Avantages

1. **Réutilisabilité** : Composants utilisables dans plusieurs contextes
2. **Maintenabilité** : Logique séparée et organisée
3. **Consistance** : Interface uniforme dans toute l'application
4. **Testabilité** : Composants isolés faciles à tester
5. **Performance** : Composants optimisés et mémorisés

## 🎯 Bonnes Pratiques

- **Props typées** avec TypeScript
- **Composants purs** sans effets de bord
- **Noms explicites** et cohérents
- **Documentation** des props et usage
- **Tests unitaires** pour chaque composant
