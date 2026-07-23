"use client";

import { useRouter } from "next/navigation";

import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  FolderKanban,
  ImagePlus,
  LayoutGrid,
  ListOrdered,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Waves,
  X,
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  image: string;
  images?: string[];
  description?: string;
  displayOrder?: number;
  isWide?: boolean | number;
  isTall?: boolean | number;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface ProjectForm {
  title: string;
  category: string;
  location: string;
  description: string;
  displayOrder: string;
  isWide: boolean;
  isTall: boolean;
}

interface GalleryItem {
  id: string;
  preview: string;
  existingPath?: string;
  file?: File;
}

type GalleryOrderItem =
  | {
      type: "existing";
      value: string;
    }
  | {
      type: "new";
      index: number;
    };

const initialForm: ProjectForm = {
  title: "",
  category: "",
  location: "",
  description: "",
  displayOrder: "0",
  isWide: false,
  isTall: false,
};

const categories = [
  "Aquaculture",
  "Balisage maritime",
  "Conduites PEHD",
  "Construction maritime",
  "Inspection navale",
  "Inspection sous-marine",
  "Maintenance électrique",
  "Maintenance industrielle",
  "Maintenance offshore",
  "Nettoyage sous-marin","Nettoyage et maintenance industrielle",
  "Protection portuaire","Protection maritime",
  "Repêchage",
  "Réparation d’ouvrages portuaires",
  "Renflouement et sauvetage maritime",
  "Soudure et découpage",
  "Soudure sous-marine",
  "Travaux hydrauliques",
  "Travaux offshore",
  "Travaux portuaires","Travaux de protection sous-marine"
];

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function toBoolean(value: boolean | number | undefined) {
  return value === true || value === 1;
}

function getImageUrl(image: string) {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  if (image.startsWith("/uploads/")) {
    return `${API_URL}${image}`;
  }

  if (image.startsWith("uploads/")) {
    return `${API_URL}/${image}`;
  }

  return image;
}

function normalizeProjectImages(project: Project): string[] {
  const values = [
    project.image,
    ...(Array.isArray(project.images) ? project.images : []),
  ];

  return Array.from(
    new Set(
      values.filter(
        (image): image is string =>
          typeof image === "string" && image.trim().length > 0
      )
    )
  );
}

function createGalleryId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

export default function AdminAccesPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectForm>(initialForm);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [projectToDelete, setProjectToDelete] =
    useState<Project | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formCardRef = useRef<HTMLElement | null>(null);
  const galleryItemsRef = useRef<GalleryItem[]>([]);

  useEffect(() => {
    galleryItemsRef.current = galleryItems;
  }, [galleryItems]);

  useEffect(() => {
    return () => {
      galleryItemsRef.current.forEach((item) => {
        if (item.file && item.preview.startsWith("blob:")) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, []);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: "GET",
        cache: "no-store",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const result: ApiResponse<Project[]> = await response.json();

      if (response.status === 401) {
        router.replace("/admin/connexion");
        router.refresh();
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Impossible de charger les travaux."
        );
      }

      setProjects(Array.isArray(result.data) ? result.data : []);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Impossible de charger les travaux."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const stats = useMemo(
    () => ({
      total: projects.length,
      wide: projects.filter((project) =>
        toBoolean(project.isWide)
      ).length,
      tall: projects.filter((project) =>
        toBoolean(project.isTall)
      ).length,
    }),
    [projects]
  );

  function handleField(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleCheckbox(event: ChangeEvent<HTMLInputElement>) {
    const { name, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: checked,
    }));
  }

  function revokeNewGalleryItems(items: GalleryItem[]) {
    items.forEach((item) => {
      if (item.file && item.preview.startsWith("blob:")) {
        URL.revokeObjectURL(item.preview);
      }
    });
  }

  function clearGallery() {
    revokeNewGalleryItems(galleryItemsRef.current);

    galleryItemsRef.current = [];
    setGalleryItems([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleImages(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);

    setError("");
    setMessage("");

    if (selectedFiles.length === 0) return;

    const remainingPlaces = 12 - galleryItems.length;

    if (remainingPlaces <= 0) {
      setError("Vous avez déjà atteint la limite de 12 photos.");
      event.target.value = "";
      return;
    }

    if (selectedFiles.length > remainingPlaces) {
      setError(
        `Vous pouvez encore ajouter seulement ${remainingPlaces} photo${
          remainingPlaces > 1 ? "s" : ""
        }.`
      );
      event.target.value = "";
      return;
    }

    const acceptedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    const invalidFile = selectedFiles.find(
      (file) => !acceptedTypes.includes(file.type)
    );

    if (invalidFile) {
      setError("Toutes les photos doivent être JPG, PNG, WEBP ou GIF.");
      event.target.value = "";
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > 10 * 1024 * 1024
    );

    if (oversizedFile) {
      setError("Chaque photo ne doit pas dépasser 10 Mo.");
      event.target.value = "";
      return;
    }

    const newItems: GalleryItem[] = selectedFiles.map((file) => ({
      id: createGalleryId("new"),
      file,
      preview: URL.createObjectURL(file),
    }));

    setGalleryItems((previous) => [...previous, ...newItems]);

    event.target.value = "";
  }

  function setAsCover(indexToMove: number) {
    if (indexToMove <= 0 || indexToMove >= galleryItems.length) {
      return;
    }

    setGalleryItems((previous) => {
      const updated = [...previous];
      const [selectedItem] = updated.splice(indexToMove, 1);
      updated.unshift(selectedItem);
      return updated;
    });

    setMessage(
      "La photo sélectionnée est maintenant la photo de couverture."
    );
    setError("");
  }

  function removeGalleryImage(indexToRemove: number) {
    const item = galleryItems[indexToRemove];

    if (item?.file && item.preview.startsWith("blob:")) {
      URL.revokeObjectURL(item.preview);
    }

    setGalleryItems((previous) =>
      previous.filter((_, index) => index !== indexToRemove)
    );

    setMessage("");
    setError("");
  }

  function cancelEditing(clearMessages = true) {
    clearGallery();
    setEditingProject(null);
    setForm(initialForm);

    if (clearMessages) {
      setMessage("");
      setError("");
    }
  }

  function resetForm() {
    cancelEditing(true);
  }

  function selectProjectForEditing(project: Project) {
    clearGallery();

    const projectImages = normalizeProjectImages(project);

    const existingItems: GalleryItem[] = projectImages.map(
      (image, index) => ({
        id: `existing-${project.id}-${index}-${image}`,
        existingPath: image,
        preview: getImageUrl(image),
      })
    );

    setEditingProject(project);
    setForm({
      title: project.title || "",
      category: project.category || "",
      location: project.location || "",
      description: project.description || "",
      displayOrder: String(project.displayOrder ?? 0),
      isWide: toBoolean(project.isWide),
      isTall: toBoolean(project.isTall),
    });
    setGalleryItems(existingItems);
    setError("");
    setMessage(
      "Mode modification activé. Modifiez les informations puis enregistrez."
    );

    window.requestAnimationFrame(() => {
      formCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function handleProjectKeyDown(
    event: KeyboardEvent<HTMLElement>,
    project: Project
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectProjectForEditing(project);
    }
  }

  function buildGalleryPayload(data: FormData) {
    const galleryOrder: GalleryOrderItem[] = [];
    let newFileIndex = 0;

    galleryItems.forEach((item) => {
      if (item.existingPath) {
        galleryOrder.push({
          type: "existing",
          value: item.existingPath,
        });
        return;
      }

      if (item.file) {
        data.append("images", item.file);

        galleryOrder.push({
          type: "new",
          index: newFileIndex,
        });

        newFileIndex += 1;
      }
    });

    data.append("galleryOrder", JSON.stringify(galleryOrder));
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    const title = form.title.trim();
    const category = form.category.trim();
    const location = form.location.trim();
    const displayOrder = Number(form.displayOrder);

    if (!title) return setError("Le titre du travail est obligatoire.");
    if (!category) return setError("La catégorie est obligatoire.");
    if (!location) return setError("Le lieu du travail est obligatoire.");

    if (galleryItems.length === 0) {
      return setError("Veuillez conserver ou sélectionner au moins une image.");
    }

    if (Number.isNaN(displayOrder) || displayOrder < 0) {
      return setError(
        "L’ordre d’affichage doit être un nombre positif."
      );
    }

    setSaving(true);

    try {
      const data = new FormData();

      data.append("title", title);
      data.append("category", category);
      data.append("location", location);
      data.append("description", form.description.trim());
      data.append("displayOrder", String(displayOrder));
      data.append("isWide", String(form.isWide));
      data.append("isTall", String(form.isTall));

      buildGalleryPayload(data);

      const isEditing = editingProject !== null;
      const requestUrl = isEditing
        ? `${API_URL}/api/projects/${editingProject.id}`
        : `${API_URL}/api/projects`;

      const response = await fetch(requestUrl, {
        method: isEditing ? "PUT" : "POST",
        credentials: "include",
        body: data,
      });

      const result: ApiResponse<Project> = await response.json();

      if (response.status === 401) {
        router.replace("/admin/connexion");
        router.refresh();
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            (isEditing
              ? "Impossible de modifier le travail."
              : "Impossible d’ajouter le travail.")
        );
      }

      cancelEditing(false);

      setMessage(
        result.message ||
          (isEditing
            ? "Le travail a été modifié avec succès."
            : "Le travail a été ajouté avec succès.")
      );

      await loadProjects();
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : editingProject
          ? "Impossible de modifier le travail."
          : "Impossible d’ajouter le travail."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(project: Project) {
    setDeletingId(project.id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/projects/${project.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result: ApiResponse<null> = await response.json();

      if (response.status === 401) {
        setProjectToDelete(null);
        router.replace("/admin/connexion");
        router.refresh();
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Impossible de supprimer le travail."
        );
      }

      setProjects((previous) =>
        previous.filter((item) => item.id !== project.id)
      );

      if (editingProject?.id === project.id) {
        cancelEditing(false);
      }

      setMessage(
        result.message || "Le travail a été supprimé avec succès."
      );
      setProjectToDelete(null);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Impossible de supprimer le travail."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-page-container">
        <section className="admin-page-heading">
          <div>
            <span className="admin-page-kicker">
              <FolderKanban size={16} />
              Portfolio entreprise
            </span>

            <h1>Gestion des réalisations</h1>

            <p>
              Cliquez sur une réalisation pour afficher ses informations dans
              le formulaire et la modifier.
            </p>
          </div>
        </section>

        <section className="admin-stat-grid">
          <article className="admin-stat-card">
            <span className="admin-stat-icon">
              <ImagePlus size={22} />
            </span>
            <div>
              <strong>{stats.total}</strong>
              <span>Travaux enregistrés</span>
            </div>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon">
              <LayoutGrid size={22} />
            </span>
            <div>
              <strong>{stats.wide}</strong>
              <span>Cartes larges</span>
            </div>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon">
              <Waves size={22} />
            </span>
            <div>
              <strong>{stats.tall}</strong>
              <span>Cartes hautes</span>
            </div>
          </article>
        </section>

        {error && (
          <div className="admin-alert admin-alert-error">
            <AlertCircle size={19} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="admin-alert admin-alert-success">
            <CheckCircle2 size={19} />
            <span>{message}</span>
          </div>
        )}

        <div className="admin-workspace">
          <section
            ref={formCardRef}
            className={`admin-card admin-form-card ${
              editingProject ? "admin-form-card-editing" : ""
            }`}
          >
            <div className="admin-card-heading">
              <span className="admin-card-icon">
                {editingProject ? <Pencil size={21} /> : <Plus size={21} />}
              </span>

              <div>
                <h2>
                  {editingProject
                    ? "Modifier la réalisation"
                    : "Ajouter une réalisation"}
                </h2>
                <p>
                  {editingProject
                    ? `Modification du projet n°${editingProject.id}.`
                    : "Renseignez les informations du nouveau projet."}
                </p>
              </div>
            </div>

            {editingProject && (
              <div className="admin-editing-banner">
                <Pencil size={17} />
                <span>
                  Vous modifiez : <strong>{editingProject.title}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => cancelEditing()}
                  disabled={saving}
                >
                  <X size={17} />
                  Annuler
                </button>
              </div>
            )}

            <form className="admin-project-form" onSubmit={saveProject}>
              <div className="admin-field">
                <label htmlFor="title">
                  Titre du travail <span>*</span>
                </label>

                <textarea
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleField}
                  placeholder="Exemple : Installation de conduites PEHD..."
                  rows={4}
                  maxLength={500}
                  disabled={saving}
                />

                <small>{form.title.length}/500 caractères</small>
              </div>

              <div className="admin-form-row">
                <div className="admin-field">
                  <label htmlFor="category">
                    Catégorie <span>*</span>
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleField}
                    disabled={saving}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-field">
                  <label htmlFor="displayOrder">Ordre d’affichage</label>
                  <div className="admin-input-icon">
                    <ListOrdered size={18} />
                    <input
                      id="displayOrder"
                      name="displayOrder"
                      type="number"
                      value={form.displayOrder}
                      onChange={handleField}
                      min="0"
                      step="1"
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-field">
                <label htmlFor="location">
                  Lieu de réalisation <span>*</span>
                </label>

                <div className="admin-input-icon">
                  <MapPin size={18} />
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleField}
                    placeholder="Exemple : Port d’Arzew, wilaya d’Oran"
                    maxLength={255}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="admin-field">
                <label htmlFor="description">
                  Description complémentaire
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleField}
                  placeholder="Informations supplémentaires concernant le travail..."
                  rows={4}
                  disabled={saving}
                />
              </div>

              <div className="admin-field">
                <label>
                  Photos du travail <span>*</span>
                </label>

                <input
                  ref={fileInputRef}
                  id="images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={handleImages}
                  className="admin-hidden-file"
                  disabled={saving || galleryItems.length >= 12}
                />

                <label
                  htmlFor="images"
                  className="admin-upload-zone"
                  aria-disabled={saving || galleryItems.length >= 12}
                >
                  <span className="admin-upload-placeholder">
                    <span className="admin-upload-icon">
                      <ImagePlus size={29} />
                    </span>

                    <strong>
                      {editingProject
                        ? "Ajouter de nouvelles photos"
                        : "Sélectionner plusieurs photos"}
                    </strong>

                    <small>
                      {galleryItems.length}/12 photos — cliquez sur une photo
                      pour la mettre en couverture
                    </small>
                  </span>
                </label>

                {galleryItems.length > 0 && (
                  <div className="admin-multi-image-grid">
                    {galleryItems.map((item, index) => (
                      <article
                        className={`admin-multi-image-item ${
                          index === 0
                            ? "admin-multi-image-cover"
                            : ""
                        }`}
                        key={item.id}
                      >
                        <button
                          type="button"
                          className="admin-image-cover-button"
                          onClick={() => setAsCover(index)}
                          disabled={saving || index === 0}
                          aria-label={
                            index === 0
                              ? "Photo de couverture actuelle"
                              : `Définir la photo ${index + 1} comme couverture`
                          }
                        >
                          <img
                            src={item.preview}
                            alt={`Aperçu ${index + 1}`}
                          />

                          <span className="admin-image-overlay">
                            {index === 0
                              ? "Photo de couverture"
                              : "Définir comme couverture"}
                          </span>
                        </button>

                        {index === 0 && (
                          <span className="admin-cover-badge">
                            <CheckCircle2 size={14} />
                            Couverture
                          </span>
                        )}

                        {item.existingPath && (
                          <span className="admin-existing-image-badge">
                            Enregistrée
                          </span>
                        )}

                        <button
                          type="button"
                          className="admin-image-remove-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeGalleryImage(index);
                          }}
                          aria-label={`Supprimer la photo ${index + 1}`}
                          disabled={saving}
                        >
                          <X size={17} strokeWidth={2.7} />
                        </button>
                      </article>
                    ))}
                  </div>
                )}

                {galleryItems.length > 0 && (
                  <span className="admin-selected-file">
                    <CheckCircle2 size={16} />
                    {galleryItems.length} photo
                    {galleryItems.length > 1 ? "s" : ""} dans la galerie
                  </span>
                )}
              </div>

              <div className="admin-format-box">
                <div>
                  <strong>Format de la carte</strong>
                  <span>Choisissez la présentation dans la galerie.</span>
                </div>

                <label className="admin-check-option">
                  <input
                    type="checkbox"
                    name="isWide"
                    checked={form.isWide}
                    onChange={handleCheckbox}
                    disabled={saving}
                  />
                  <span className="admin-check-mark">
                    <CheckCircle2 size={15} />
                  </span>
                  <span>
                    <strong>Carte large</strong>
                    <small>Occupe deux colonnes.</small>
                  </span>
                </label>

                <label className="admin-check-option">
                  <input
                    type="checkbox"
                    name="isTall"
                    checked={form.isTall}
                    onChange={handleCheckbox}
                    disabled={saving}
                  />
                  <span className="admin-check-mark">
                    <CheckCircle2 size={15} />
                  </span>
                  <span>
                    <strong>Carte haute</strong>
                    <small>Hauteur supérieure.</small>
                  </span>
                </label>
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-button admin-button-secondary"
                  onClick={resetForm}
                  disabled={saving}
                >
                  <RotateCcw size={18} />
                  {editingProject ? "Annuler la modification" : "Réinitialiser"}
                </button>

                <button
                  type="submit"
                  className="admin-button admin-button-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="admin-spin" />
                      {editingProject
                        ? "Modification..."
                        : "Enregistrement..."}
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {editingProject
                        ? "Enregistrer les modifications"
                        : "Publier le travail"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          <section className="admin-card admin-list-card">
            <div className="admin-card-heading admin-list-heading">
              <div>
                <h2>Travaux enregistrés</h2>
                <p>
                  Cliquez sur un projet pour le modifier.
                </p>
              </div>

              <span className="admin-count-badge">{projects.length}</span>
            </div>

            {loading ? (
              <div className="admin-state-box">
                <Loader2 size={34} className="admin-spin" />
                <span>Chargement des travaux...</span>
              </div>
            ) : projects.length === 0 ? (
              <div className="admin-state-box">
                <span className="admin-empty-icon">
                  <ImagePlus size={31} />
                </span>
                <h3>Aucun travail enregistré</h3>
                <p>Ajoutez votre première réalisation avec le formulaire.</p>
              </div>
            ) : (
              <div className="admin-project-list">
                {projects.map((project, index) => {
                  const wide = toBoolean(project.isWide);
                  const tall = toBoolean(project.isTall);
                  const selected = editingProject?.id === project.id;

                  return (
                    <article
                      key={project.id}
                      className={`admin-project-item admin-project-item-clickable ${
                        selected ? "admin-project-item-selected" : ""
                      }`}
                      role="button"
                      tabIndex={0}
                      onClick={() => selectProjectForEditing(project)}
                      onKeyDown={(event) =>
                        handleProjectKeyDown(event, project)
                      }
                      aria-label={`Modifier ${project.title}`}
                    >
                      <div className="admin-project-thumbnail">
                        <img
                          src={getImageUrl(project.image)}
                          alt={project.title}
                          loading="lazy"
                        />
                        <span>{String(index + 1).padStart(2, "0")}</span>
                      </div>

                      <div className="admin-project-main">
                        <div className="admin-project-meta">
                          <span className="admin-category">
                            {project.category}
                          </span>
                          <span className="admin-order">
                            Ordre {project.displayOrder ?? index + 1}
                          </span>
                        </div>

                        <h3>{project.title}</h3>

                        <p>
                          <MapPin size={15} />
                          {project.location || "Lieu non renseigné"}
                        </p>

                        <div className="admin-project-footer">
                          <div className="admin-project-tags">
                            {wide && <span>Large</span>}
                            {tall && <span>Haute</span>}
                            {!wide && !tall && <span>Standard</span>}
                          </div>

                          <div className="admin-project-actions">
                            <button
                              type="button"
                              className="admin-edit-button"
                              onClick={(event) => {
                                event.stopPropagation();
                                selectProjectForEditing(project);
                              }}
                              disabled={saving}
                              aria-label={`Modifier ${project.title}`}
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              className="admin-delete-button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setProjectToDelete(project);
                              }}
                              disabled={deletingId === project.id}
                              aria-label={`Supprimer ${project.title}`}
                            >
                              {deletingId === project.id ? (
                                <Loader2
                                  size={16}
                                  className="admin-spin"
                                />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {projectToDelete && (
        <div
          className="admin-delete-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              deletingId === null
            ) {
              setProjectToDelete(null);
            }
          }}
        >
          <section
            className="admin-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-delete-modal-title"
          >
            <button
              type="button"
              className="admin-delete-modal-close"
              onClick={() => setProjectToDelete(null)}
              disabled={deletingId === projectToDelete.id}
              aria-label="Fermer la confirmation"
            >
              <X size={20} />
            </button>

            <div className="admin-delete-modal-icon">
              <Trash2 size={30} />
            </div>

            <span className="admin-delete-modal-kicker">
              Confirmation de suppression
            </span>

            <h2 id="admin-delete-modal-title">
              Supprimer cette réalisation ?
            </h2>

            <p className="admin-delete-modal-description">
              Cette action est définitive. La réalisation sera supprimée de
              la base de données et ne sera plus visible dans le portfolio.
            </p>

            <article className="admin-delete-project-preview">
              <div className="admin-delete-project-image">
                <img
                  src={getImageUrl(projectToDelete.image)}
                  alt={projectToDelete.title}
                />
              </div>

              <div className="admin-delete-project-content">
                <span>{projectToDelete.category}</span>
                <h3>{projectToDelete.title}</h3>
                <p>
                  <MapPin size={15} />
                  {projectToDelete.location || "Lieu non renseigné"}
                </p>
              </div>
            </article>

            <div className="admin-delete-warning">
              <AlertCircle size={18} />
              <span>Vous ne pourrez pas annuler cette suppression.</span>
            </div>

            <div className="admin-delete-modal-actions">
              <button
                type="button"
                className="admin-delete-cancel"
                onClick={() => setProjectToDelete(null)}
                disabled={deletingId === projectToDelete.id}
              >
                Annuler
              </button>

              <button
                type="button"
                className="admin-delete-confirm"
                onClick={() => deleteProject(projectToDelete)}
                disabled={deletingId === projectToDelete.id}
              >
                {deletingId === projectToDelete.id ? (
                  <>
                    <Loader2 size={18} className="admin-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Supprimer définitivement
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
