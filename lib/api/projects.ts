export interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  image: string;
  description: string;
  displayOrder: number;
  isActive?: boolean | number | string;
  isWide: boolean | number | string;
  isTall: boolean | number | string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProjectsApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: Project[];
}

interface ProjectApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: Project;
}

/*
 * API_URL est utilisée côté serveur Next.js.
 *
 * Dans .env.local :
 *
 * API_URL=http://localhost:5000
 * NEXT_PUBLIC_API_URL=http://localhost:5000
 */
const API_URL = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

/**
 * Convertit les différentes représentations
 * de booléens en véritable boolean.
 */
export function toBoolean(
  value:
    | boolean
    | number
    | string
    | null
    | undefined
): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalizedValue = value
      .trim()
      .toLowerCase();

    return (
      normalizedValue === "1" ||
      normalizedValue === "true" ||
      normalizedValue === "yes" ||
      normalizedValue === "oui"
    );
  }

  return false;
}

/**
 * Retourne l’adresse correcte d’une image.
 *
 * Exemples :
 *
 * /images/...  => image locale Next.js
 * /uploads/... => image provenant du backend Express
 * http...      => image distante
 */
export function getProjectImageUrl(
  image: string | null | undefined
): string {
  const normalizedImage =
    typeof image === "string"
      ? image.trim()
      : "";

  if (!normalizedImage) {
    return "/images/placeholder.jpg";
  }

  if (
    normalizedImage.startsWith("http://") ||
    normalizedImage.startsWith("https://") ||
    normalizedImage.startsWith("data:") ||
    normalizedImage.startsWith("blob:")
  ) {
    return normalizedImage;
  }

  if (normalizedImage.startsWith("/uploads/")) {
    return `${API_URL}${normalizedImage}`;
  }

  if (normalizedImage.startsWith("uploads/")) {
    return `${API_URL}/${normalizedImage}`;
  }

  if (normalizedImage.startsWith("/")) {
    return normalizedImage;
  }

  return `/${normalizedImage}`;
}

/**
 * Retourne le texte contenu dans la réponse HTTP.
 * Cette fonction permet d’afficher l’erreur réelle
 * retournée par Express.
 */
async function readResponseText(
  response: Response
): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

/**
 * Transforme le texte HTTP en JSON.
 */
function parseJsonResponse<T>(
  responseText: string,
  url: string
): T {
  if (!responseText.trim()) {
    throw new Error(
      `Le serveur a retourné une réponse vide pour ${url}.`
    );
  }

  try {
    return JSON.parse(responseText) as T;
  } catch {
    throw new Error(
      `Le serveur Express n’a pas retourné un JSON valide pour ${url}. Réponse reçue : ${responseText}`
    );
  }
}

/**
 * Normalise un projet reçu depuis Express/MySQL.
 */
function normalizeProject(
  project: Project
): Project {
  return {
    ...project,

    id: Number(project.id),

    title:
      typeof project.title === "string"
        ? project.title
        : "",

    category:
      typeof project.category === "string"
        ? project.category
        : "",

    location:
      typeof project.location === "string"
        ? project.location
        : "",

    image:
      typeof project.image === "string"
        ? project.image
        : "",

    description:
      typeof project.description === "string"
        ? project.description
        : "",

    displayOrder:
      Number(project.displayOrder) || 0,

    isActive:
      project.isActive === undefined
        ? undefined
        : toBoolean(project.isActive),

    isWide: toBoolean(project.isWide),

    isTall: toBoolean(project.isTall),
  };
}

/**
 * Charge tous les projets actifs.
 *
 * Flux :
 * Next.js -> Express -> MySQL
 */
export async function getProjects(): Promise<
  Project[]
> {
  const url = `${API_URL}/api/projects`;

  try {
    console.log(
      "[getProjects] Chargement depuis :",
      url
    );

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const responseText =
      await readResponseText(response);

    if (!response.ok) {
      console.error(
        "[getProjects] Erreur HTTP :",
        {
          url,
          status: response.status,
          statusText: response.statusText,
          response: responseText,
        }
      );

      let serverMessage = responseText;

      try {
        const parsedError = JSON.parse(
          responseText
        ) as {
          message?: string;
          error?: string;
        };

        serverMessage =
          parsedError.error ||
          parsedError.message ||
          responseText;
      } catch {
        // On conserve le texte original.
      }

      throw new Error(
        `Erreur HTTP ${response.status} pendant le chargement des travaux : ${
          serverMessage ||
          response.statusText ||
          "Erreur inconnue"
        }`
      );
    }

    const result =
      parseJsonResponse<ProjectsApiResponse>(
        responseText,
        url
      );

    if (!result.success) {
      throw new Error(
        result.error ||
          result.message ||
          "Le serveur n’a pas pu charger les travaux."
      );
    }

    const projects = Array.isArray(result.data)
      ? result.data.map(normalizeProject)
      : [];

    return projects.sort((first, second) => {
      const firstOrder =
        Number(first.displayOrder) || 0;

      const secondOrder =
        Number(second.displayOrder) || 0;

      if (firstOrder !== secondOrder) {
        return firstOrder - secondOrder;
      }

      return Number(second.id) - Number(first.id);
    });
  } catch (error) {
    console.error(
      "[getProjects] Erreur complète :",
      error
    );

    /*
     * On retourne un tableau vide pour que
     * PortfolioPage continue de fonctionner.
     */
    return [];
  }
}

/**
 * Charge un seul projet selon son identifiant.
 */
export async function getProjectById(
  id: number
): Promise<Project | null> {
  const projectId = Number(id);

  if (
    !Number.isInteger(projectId) ||
    projectId <= 0
  ) {
    console.error(
      "[getProjectById] Identifiant invalide :",
      id
    );

    return null;
  }

  const url = `${API_URL}/api/projects/${projectId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const responseText =
      await readResponseText(response);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      console.error(
        "[getProjectById] Erreur HTTP :",
        {
          url,
          status: response.status,
          statusText: response.statusText,
          response: responseText,
        }
      );

      return null;
    }

    const result =
      parseJsonResponse<ProjectApiResponse>(
        responseText,
        url
      );

    if (!result.success || !result.data) {
      return null;
    }

    return normalizeProject(result.data);
  } catch (error) {
    console.error(
      "[getProjectById] Erreur :",
      error
    );

    return null;
  }
}