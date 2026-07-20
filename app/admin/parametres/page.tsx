"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: number | boolean;
  created_at?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UserForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialPasswordForm: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const initialUserForm: UserForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function AdminSettingsPage() {
  const router = useRouter();

  const [profile, setProfile] =
    useState<AdminUser | null>(null);

  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [loadingProfile, setLoadingProfile] =
    useState(true);

  const [loadingUsers, setLoadingUsers] =
    useState(true);

  const [savingPassword, setSavingPassword] =
    useState(false);

  const [creatingUser, setCreatingUser] =
    useState(false);

  const [passwordForm, setPasswordForm] =
    useState<PasswordForm>(
      initialPasswordForm
    );

  const [userForm, setUserForm] =
    useState<UserForm>(
      initialUserForm
    );

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    showUserPassword,
    setShowUserPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  function handleUnauthorized(
    response: Response
  ) {
    if (response.status === 401) {
      router.replace(
        "/admin/connexion"
      );

      router.refresh();

      return true;
    }

    return false;
  }

  const loadProfile =
    useCallback(async () => {
      setLoadingProfile(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (
          handleUnauthorized(response)
        ) {
          return;
        }

        const result: ApiResponse<AdminUser> =
          await response.json();

        if (
          !response.ok ||
          !result.success ||
          !result.data
        ) {
          throw new Error(
            result.message ||
              "Impossible de charger le profil."
          );
        }

        setProfile(result.data);
      } catch (exception) {
        setError(
          exception instanceof Error
            ? exception.message
            : "Impossible de charger le profil."
        );
      } finally {
        setLoadingProfile(false);
      }
    }, [router]);

  const loadUsers =
    useCallback(async () => {
      setLoadingUsers(true);

      try {
        const response = await fetch(
          `${API_URL}/api/auth/users`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (
          handleUnauthorized(response)
        ) {
          return;
        }

        const result: ApiResponse<
          AdminUser[]
        > = await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Impossible de charger les utilisateurs."
          );
        }

        setUsers(
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (exception) {
        setError(
          exception instanceof Error
            ? exception.message
            : "Impossible de charger les utilisateurs."
        );
      } finally {
        setLoadingUsers(false);
      }
    }, [router]);

  useEffect(() => {
    loadProfile();
    loadUsers();
  }, [
    loadProfile,
    loadUsers,
  ]);

  function handlePasswordChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const {
      name,
      value,
    } = event.target;

    setPasswordForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  }

  function handleUserChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const {
      name,
      value,
    } = event.target;

    setUserForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  }

  async function changePassword(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (
      passwordForm.newPassword.length <
      8
    ) {
      setError(
        "Le nouveau mot de passe doit contenir au moins 8 caractères."
      );

      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setError(
        "La confirmation du mot de passe est incorrecte."
      );

      return;
    }

    setSavingPassword(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/change-password`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            currentPassword:
              passwordForm.currentPassword,

            newPassword:
              passwordForm.newPassword,

            confirmPassword:
              passwordForm.confirmPassword,
          }),
        }
      );

      if (
        handleUnauthorized(response)
      ) {
        return;
      }

      const result: ApiResponse<null> =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Impossible de modifier le mot de passe."
        );
      }

      setPasswordForm(
        initialPasswordForm
      );

      setMessage(
        result.message ||
          "Mot de passe modifié avec succès."
      );
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Impossible de modifier le mot de passe."
      );
    } finally {
      setSavingPassword(false);
    }
  }

  async function createUser(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    const name =
      userForm.name.trim();

    const email =
      userForm.email
        .trim()
        .toLowerCase();

    if (!name || !email) {
      setError(
        "Le nom et l’adresse email sont obligatoires."
      );

      return;
    }

    if (
      userForm.password.length < 8
    ) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères."
      );

      return;
    }

    if (
      userForm.password !==
      userForm.confirmPassword
    ) {
      setError(
        "La confirmation du mot de passe est incorrecte."
      );

      return;
    }

    setCreatingUser(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/users`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password:
              userForm.password,

            confirmPassword:
              userForm.confirmPassword,
          }),
        }
      );

      if (
        handleUnauthorized(response)
      ) {
        return;
      }

      const result: ApiResponse<AdminUser> =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Impossible d’ajouter l’utilisateur."
        );
      }

      setUserForm(
        initialUserForm
      );

      setMessage(
        result.message ||
          "Administrateur ajouté avec succès."
      );

      await loadUsers();
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Impossible d’ajouter l’utilisateur."
      );
    } finally {
      setCreatingUser(false);
    }
  }

  function formatDate(
    value?: string
  ) {
    if (!value) {
      return "Date inconnue";
    }

    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return new Intl.DateTimeFormat(
      "fr-FR",
      {
        dateStyle: "medium",
      }
    ).format(date);
  }

  return (
    <main className="admin-page">
      <div className="admin-page-container">
        <section className="admin-page-heading">
          <div>
            <span className="admin-page-kicker">
              <Settings size={16} />
              Configuration
            </span>

            <h1>Paramètres</h1>

            <p>
              Gérez votre profil, votre mot de passe
              et les utilisateurs autorisés.
            </p>
          </div>

          <button
            type="button"
            className="admin-settings-refresh"
            onClick={() => {
              loadProfile();
              loadUsers();
            }}
            disabled={
              loadingProfile ||
              loadingUsers
            }
          >
            <RefreshCw
              size={17}
              className={
                loadingProfile ||
                loadingUsers
                  ? "admin-spin"
                  : ""
              }
            />

            Actualiser
          </button>
        </section>

        {error && (
          <div className="admin-settings-alert admin-settings-alert-error">
            <AlertCircle size={19} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="admin-settings-alert admin-settings-alert-success">
            <CheckCircle2 size={19} />
            <span>{message}</span>
          </div>
        )}

        <section className="admin-settings-main-grid">
          <article className="admin-card admin-profile-panel">
            <div className="admin-setting-title">
              <span className="admin-card-icon">
                <UserRound size={22} />
              </span>

              <div>
                <h2>
                  Profil administrateur
                </h2>

                <p>
                  Informations du compte actuellement
                  connecté.
                </p>
              </div>
            </div>

            {loadingProfile ? (
              <div className="admin-settings-loading">
                <Loader2
                  size={25}
                  className="admin-spin"
                />

                Chargement du profil...
              </div>
            ) : profile ? (
              <>
                <div className="admin-profile-identity">
                  <span className="admin-profile-avatar">
                    {profile.name
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <div>
                    <strong>
                      {profile.name}
                    </strong>

                    <span>
                      {profile.email}
                    </span>
                  </div>
                </div>

                <div className="admin-profile-details">
                  <div className="admin-profile-detail">
                    <span>
                      <UserRound size={17} />
                      Nom complet
                    </span>

                    <strong>
                      {profile.name}
                    </strong>
                  </div>

                  <div className="admin-profile-detail">
                    <span>
                      <Mail size={17} />
                      Adresse email
                    </span>

                    <strong>
                      {profile.email}
                    </strong>
                  </div>

                  <div className="admin-profile-detail">
                    <span>
                      <ShieldCheck size={17} />
                      Rôle
                    </span>

                    <strong className="admin-role-badge">
                      {profile.role}
                    </strong>
                  </div>

                  <div className="admin-profile-detail">
                    <span>
                      <ShieldCheck size={17} />
                      État du compte
                    </span>

                    <strong
                      className={
                        profile.is_active
                          ? "admin-status-active"
                          : "admin-status-disabled"
                      }
                    >
                      {profile.is_active
                        ? "Actif"
                        : "Désactivé"}
                    </strong>
                  </div>
                </div>
              </>
            ) : (
              <p>
                Profil indisponible.
              </p>
            )}
          </article>

          <article className="admin-card admin-password-panel">
            <div className="admin-setting-title">
              <span className="admin-card-icon">
                <KeyRound size={22} />
              </span>

              <div>
                <h2>
                  Modifier le mot de passe
                </h2>

                <p>
                  Choisissez un mot de passe sécurisé
                  d’au moins 8 caractères.
                </p>
              </div>
            </div>

            <form
              className="admin-settings-form"
              onSubmit={changePassword}
            >
              <label>
                <span>
                  Mot de passe actuel
                </span>

                <div className="admin-settings-input">
                  <LockKeyhole
                    size={18}
                  />

                  <input
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    name="currentPassword"
                    value={
                      passwordForm.currentPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Votre mot de passe actuel"
                    autoComplete="current-password"
                    required
                    disabled={savingPassword}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    aria-label="Afficher ou masquer le mot de passe"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </label>

              <label>
                <span>
                  Nouveau mot de passe
                </span>

                <div className="admin-settings-input">
                  <KeyRound size={18} />

                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    name="newPassword"
                    value={
                      passwordForm.newPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Minimum 8 caractères"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={savingPassword}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    aria-label="Afficher ou masquer le mot de passe"
                  >
                    {showNewPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </label>

              <label>
                <span>
                  Confirmer le nouveau mot de passe
                </span>

                <div className="admin-settings-input">
                  <KeyRound size={18} />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      passwordForm.confirmPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Confirmez le mot de passe"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={savingPassword}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    aria-label="Afficher ou masquer le mot de passe"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                className="admin-settings-submit"
                disabled={savingPassword}
              >
                {savingPassword ? (
                  <>
                    <Loader2
                      size={18}
                      className="admin-spin"
                    />
                    Modification...
                  </>
                ) : (
                  <>
                    <KeyRound size={18} />
                    Modifier le mot de passe
                  </>
                )}
              </button>
            </form>
          </article>
        </section>

        <section className="admin-settings-users-grid">
          <article className="admin-card admin-create-user-panel">
            <div className="admin-setting-title">
              <span className="admin-card-icon">
                <UserPlus size={22} />
              </span>

              <div>
                <h2>
                  Ajouter un utilisateur
                </h2>

                <p>
                  Créez un nouveau compte
                  administrateur.
                </p>
              </div>
            </div>

            <form
              className="admin-settings-form"
              onSubmit={createUser}
            >
              <label>
                <span>
                  Nom complet
                </span>

                <div className="admin-settings-input">
                  <UserRound size={18} />

                  <input
                    type="text"
                    name="name"
                    value={userForm.name}
                    onChange={
                      handleUserChange
                    }
                    placeholder="Nom de l’administrateur"
                    autoComplete="name"
                    required
                    disabled={creatingUser}
                  />
                </div>
              </label>

              <label>
                <span>
                  Adresse email
                </span>

                <div className="admin-settings-input">
                  <Mail size={18} />

                  <input
                    type="email"
                    name="email"
                    value={userForm.email}
                    onChange={
                      handleUserChange
                    }
                    placeholder="utilisateur@farreservice.dz"
                    autoComplete="email"
                    required
                    disabled={creatingUser}
                  />
                </div>
              </label>

              <label>
                <span>
                  Mot de passe
                </span>

                <div className="admin-settings-input">
                  <LockKeyhole
                    size={18}
                  />

                  <input
                    type={
                      showUserPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={
                      userForm.password
                    }
                    onChange={
                      handleUserChange
                    }
                    placeholder="Minimum 8 caractères"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={creatingUser}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowUserPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    aria-label="Afficher ou masquer le mot de passe"
                  >
                    {showUserPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </label>

              <label>
                <span>
                  Confirmation
                </span>

                <div className="admin-settings-input">
                  <KeyRound size={18} />

                  <input
                    type={
                      showUserPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      userForm.confirmPassword
                    }
                    onChange={
                      handleUserChange
                    }
                    placeholder="Confirmez le mot de passe"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={creatingUser}
                  />
                </div>
              </label>

              <button
                type="submit"
                className="admin-settings-submit"
                disabled={creatingUser}
              >
                {creatingUser ? (
                  <>
                    <Loader2
                      size={18}
                      className="admin-spin"
                    />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Ajouter l’utilisateur
                  </>
                )}
              </button>
            </form>
          </article>

          <article className="admin-card admin-users-panel">
            <div className="admin-setting-title">
              <span className="admin-card-icon">
                <Users size={22} />
              </span>

              <div>
                <h2>
                  Utilisateurs autorisés
                </h2>

                <p>
                  Liste des comptes ayant accès à
                  l’administration.
                </p>
              </div>
            </div>

            {loadingUsers ? (
              <div className="admin-settings-loading">
                <Loader2
                  size={25}
                  className="admin-spin"
                />

                Chargement des utilisateurs...
              </div>
            ) : users.length === 0 ? (
              <div className="admin-settings-empty">
                <Users size={35} />

                <p>
                  Aucun utilisateur trouvé.
                </p>
              </div>
            ) : (
              <div className="admin-users-list">
                {users.map(
                  (user) => (
                    <article
                      key={user.id}
                      className="admin-user-row"
                    >
                      <span className="admin-user-avatar">
                        {user.name
                          .charAt(0)
                          .toUpperCase()}
                      </span>

                      <div className="admin-user-info">
                        <strong>
                          {user.name}
                        </strong>

                        <span>
                          {user.email}
                        </span>

                        <small>
                          Créé le{" "}
                          {formatDate(
                            user.created_at
                          )}
                        </small>
                      </div>

                      <div className="admin-user-meta">
                        <span className="admin-role-badge">
                          {user.role}
                        </span>

                        <span
                          className={
                            user.is_active
                              ? "admin-status-active"
                              : "admin-status-disabled"
                          }
                        >
                          {user.is_active
                            ? "Actif"
                            : "Désactivé"}
                        </span>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}