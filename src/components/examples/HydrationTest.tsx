"use client";

import { DateDisplay } from "@/components/atoms/DateDisplay";
import { formatDate } from "@/lib/utils/date";

export function HydrationTest() {
  const testDate = "2024-02-27T10:30:00Z";

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-semibold">Test d'hydratation des dates</h2>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">
            ❌ Problématique (cause l'hydratation)
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            Cette approche cause des erreurs d'hydratation :
          </p>
          <code className="bg-muted p-2 rounded text-sm">
            {`{new Date("${testDate}").toLocaleDateString()}`}
          </code>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">
            ✅ Solution 1 : Utilitaire formatDate
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            Utilise un format fixe pour éviter les différences de locale :
          </p>
          <div className="bg-muted p-2 rounded">
            <strong>Résultat :</strong> {formatDate(testDate)}
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">
            ✅ Solution 2 : Composant DateDisplay
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            Gère l'hydratation de manière sûre avec un placeholder :
          </p>
          <div className="space-y-2">
            <div className="bg-muted p-2 rounded">
              <strong>Format date :</strong>{" "}
              <DateDisplay date={testDate} format="date" />
            </div>
            <div className="bg-muted p-2 rounded">
              <strong>Format datetime :</strong>{" "}
              <DateDisplay date={testDate} format="datetime" />
            </div>
            <div className="bg-muted p-2 rounded">
              <strong>Format relatif :</strong>{" "}
              <DateDisplay date={testDate} format="relative" />
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-blue-50">
          <h3 className="font-medium mb-2">💡 Comment tester</h3>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Ouvrir les DevTools (F12)</li>
            <li>Aller dans l'onglet Console</li>
            <li>Rafraîchir la page</li>
            <li>Vérifier qu'il n'y a pas d'erreur "Hydration failed"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
