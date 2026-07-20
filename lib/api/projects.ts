export interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  image: string;
  description: string;
  displayOrder: number;
  isWide: boolean | number;
  isTall: boolean | number;
  createdAt?: string;
  updatedAt?: string;
}

interface ProjectsApiResponse {
  success: boolean;
  message?: string;
  data?: Project[];
}

const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

/**
 * Convertit les valeurs MySQL 0/1 en booléen.
 */
export function toBoolean(
  value: boolean | number | string | undefined
): boolean {
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true"
  );
}

/**
 * Retourne l'adresse correcte d'une image.
 *
 * /images/...  => image locale de Next.js
 * /uploads/... => image enregistrée par Express
 */
export function getProjectImageUrl(image: string): string {
  if (!image) {
    return "/images/placeholder.jpg";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  if (image.startsWith("/uploads/")) {
    return `${API_URL}${image}`;
  }

  return image;
}

/**
 * Charge tous les travaux actifs depuis Express/MySQL.
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/projects`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Erreur HTTP ${response.status} pendant le chargement des travaux.`
      );
    }

    const result: ProjectsApiResponse =
      await response.json();

    if (!result.success) {
      throw new Error(
        result.message ||
          "Le serveur n’a pas pu charger les travaux."
      );
    }

    const projects = Array.isArray(result.data)
      ? result.data
      : [];

    return projects.sort((first, second) => {
      const firstOrder = Number(
        first.displayOrder || 0
      );

      const secondOrder = Number(
        second.displayOrder || 0
      );

      if (firstOrder !== secondOrder) {
        return firstOrder - secondOrder;
      }

      return first.id - second.id;
    });
  } catch (error) {
    console.error(
      "Erreur dans getProjects :",
      error
    );

    return [];
  }
}

/**
 * Charge un seul travail selon son identifiant.
 */
export async function getProjectById(
  id: number
): Promise<Project | null> {
  try {
    const response = await fetch(
      `${API_URL}/api/projects/${id}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const result: {
      success: boolean;
      data?: Project;
    } = await response.json();

    return result.success && result.data
      ? result.data
      : null;
  } catch (error) {
    console.error(
      "Erreur dans getProjectById :",
      error
    );

    return null;
  }
}