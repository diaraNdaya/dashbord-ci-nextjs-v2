/**
 * Formate une date de manière cohérente entre le serveur et le client
 * pour éviter les erreurs d'hydratation
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);

    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return "Date invalide";
    }

    // Format fixe pour éviter les problèmes d'hydratation
    // Utilise le format ISO puis le convertit en format français
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Erreur lors du formatage de la date:", error);
    return "Date invalide";
  }
}

/**
 * Formate une date avec l'heure
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Date invalide";
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} à ${hours}:${minutes}`;
  } catch (error) {
    console.error("Erreur lors du formatage de la date/heure:", error);
    return "Date invalide";
  }
}

/**
 * Formate une date de manière relative (il y a X jours)
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();

    if (isNaN(date.getTime())) {
      return "Date invalide";
    }

    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Aujourd'hui";
    } else if (diffInDays === 1) {
      return "Hier";
    } else if (diffInDays < 7) {
      return `Il y a ${diffInDays} jours`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `Il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `Il y a ${months} mois`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `Il y a ${years} an${years > 1 ? "s" : ""}`;
    }
  } catch (error) {
    console.error("Erreur lors du formatage de la date relative:", error);
    return formatDate(dateString);
  }
}
