"use client";

import { useRouter } from "next/navigation";

import {
  ChangeEvent,
  FormEvent,
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
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Upload,
  Waves,
  X,
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  image: string;
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
  "Nettoyage sous-marin",
  "Protection portuaire",
  "Repêchage",
  "Soudure et découpage",
  "Soudure sous-marine",
  "Travaux hydrauliques",
  "Travaux offshore",
  "Travaux portuaires",
];

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

  return image;
}

export default function AdminAccesPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectForm>(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: "GET",
        cache: "no-store",
        credentials: "include",
        headers: { Accept: "application/json" },
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

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const stats = useMemo(
    () => ({
      total: projects.length,
      wide: projects.filter((project) => toBoolean(project.isWide)).length,
      tall: projects.filter((project) => toBoolean(project.isTall)).length,
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

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setError("");
    setMessage("");

    if (!file) return;

    const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!acceptedTypes.includes(file.type)) {
      setError("Le fichier doit être une image JPG, PNG ou WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La taille de l’image ne doit pas dépasser 5 Mo.");
      event.target.value = "";
      return;
    }

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function resetForm() {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm(initialForm);
    setImageFile(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function createProject(event: FormEvent<HTMLFormElement>) {
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
    if (!imageFile) return setError("Veuillez sélectionner une image.");

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
      data.append("imageFile", imageFile);

      const response = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        credentials: "include",
        body: data,
      });

      const result: ApiResponse<{ id: number }> = await response.json();

      if (response.status === 401) {
        router.replace("/admin/connexion");
        router.refresh();
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Impossible d’ajouter le travail."
        );
      }

      setMessage(
        result.message || "Le travail a été ajouté avec succès."
      );

      resetForm();
      await loadProjects();
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
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
              Ajoutez, organisez et publiez les travaux visibles dans le
              portfolio de Farre Service.
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
          <section className="admin-card admin-form-card">
            <div className="admin-card-heading">
              <span className="admin-card-icon">
                <Plus size={21} />
              </span>
              <div>
                <h2>Ajouter une réalisation</h2>
                <p>Renseignez les informations du nouveau projet.</p>
              </div>
            </div>

            <form className="admin-project-form" onSubmit={createProject}>
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
                <label htmlFor="description">Description complémentaire</label>
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
                  Image du travail <span>*</span>
                </label>

                <input
                  ref={fileInputRef}
                  id="imageFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImage}
                  className="admin-hidden-file"
                  disabled={saving}
                />

                <label htmlFor="imageFile" className="admin-upload-zone">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Aperçu du travail"
                        className="admin-image-preview"
                      />
                      <span className="admin-image-overlay">
                        <Upload size={23} />
                        Changer l’image
                      </span>
                    </>
                  ) : (
                    <span className="admin-upload-placeholder">
                      <span className="admin-upload-icon">
                        <ImagePlus size={29} />
                      </span>
                      <strong>Sélectionner une image</strong>
                      <small>JPG, PNG ou WEBP — Maximum 5 Mo</small>
                    </span>
                  )}
                </label>

                {imageFile && (
                  <span className="admin-selected-file">
                    <CheckCircle2 size={16} />
                    {imageFile.name}
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
                  Réinitialiser
                </button>

                <button
                  type="submit"
                  className="admin-button admin-button-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="admin-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Publier le travail
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
                  {projects.length} réalisation
                  {projects.length !== 1 ? "s" : ""} dans la galerie.
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

                  return (
                    <article key={project.id} className="admin-project-item">
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

                          <button
                            type="button"
                            className="admin-delete-button"
                            onClick={() => setProjectToDelete(project)}
                            disabled={deletingId === project.id}
                          >
                            {deletingId === project.id ? (
                              <Loader2 size={16} className="admin-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                
                          </button>
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
