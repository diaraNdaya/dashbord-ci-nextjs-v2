// Messages et textes de l'application en français (version ivoirienne)
export const MESSAGES = {
  // Messages d'erreur généraux
  ERRORS: {
    NETWORK_ERROR: "Erreur de connexion réseau",
    UNEXPECTED_ERROR: "Une erreur inattendue s'est produite",
    API_ERROR: "Erreur de l'API",
    CONNECTION_ERROR: "Erreur de connexion",
    ACCESS_DENIED:
      "Accès refusé : Vous n'êtes pas autorisé à accéder à cette application. Seuls les administrateurs peuvent se connecter.",
    PROFILE_FETCH_ERROR: "Erreur lors de la récupération du profil",
  },

  // Messages de succès
  SUCCESS: {
    LOGIN_SUCCESS: "Connexion réussie",
    LOGOUT_SUCCESS: "Déconnexion réussie",
    PROFILE_UPDATED: "Profil mis à jour avec succès",
    SETTINGS_SAVED: "Paramètres sauvegardés",
  },

  // Messages de chargement
  LOADING: {
    LOADING: "Chargement...",
    LOGGING_IN: "Connexion en cours...",
    LOGGING_OUT: "Déconnexion en cours...",
    SAVING: "Sauvegarde en cours...",
  },

  // Messages de validation
  VALIDATION: {
    REQUIRED_FIELD: "Ce champ est requis",
    INVALID_EMAIL: "Adresse email invalide",
    PASSWORD_TOO_SHORT: "Le mot de passe doit contenir au moins 6 caractères",
    PASSWORDS_DONT_MATCH: "Les mots de passe ne correspondent pas",
  },

  // Messages de statut
  STATUS: {
    ACTIVE: "Actif",
    INACTIVE: "Inactif",
    PENDING: "En attente",
    COMPLETED: "Terminé",
    CANCELLED: "Annulé",
  },

  // Messages généraux
  GENERAL: {
    NOT_SPECIFIED: "Non renseigné",
    NOT_FOUND: "Non trouvé",
    USER_NOT_FOUND: "Utilisateur non trouvé",
    NO_DATA: "Aucune donnée disponible",
    COMING_SOON: "Bientôt disponible",
  },

  // Actions
  ACTIONS: {
    SAVE: "Enregistrer",
    CANCEL: "Annuler",
    DELETE: "Supprimer",
    EDIT: "Modifier",
    VIEW: "Voir",
    CREATE: "Créer",
    UPDATE: "Mettre à jour",
    SEARCH: "Rechercher",
    FILTER: "Filtrer",
    EXPORT: "Exporter",
    IMPORT: "Importer",
  },
} as const;

// Types pour l'autocomplétion
export type MessageKey = keyof typeof MESSAGES;
export type ErrorMessageKey = keyof typeof MESSAGES.ERRORS;
export type SuccessMessageKey = keyof typeof MESSAGES.SUCCESS;
export type LoadingMessageKey = keyof typeof MESSAGES.LOADING;
export type ValidationMessageKey = keyof typeof MESSAGES.VALIDATION;
export type StatusMessageKey = keyof typeof MESSAGES.STATUS;
export type GeneralMessageKey = keyof typeof MESSAGES.GENERAL;
export type ActionMessageKey = keyof typeof MESSAGES.ACTIONS;
