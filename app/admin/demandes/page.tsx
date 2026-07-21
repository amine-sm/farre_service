"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  AlertCircle,
  Building2,
  CalendarRange,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Inbox,
  Loader2,
  Mail,
  MailOpen,
  MessageSquare,
  Phone,
  RefreshCw,
  Reply,
  Search,
  Trash2,
  UserRound,
  Wrench,
  X,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const REQUEST_REFRESH_INTERVAL =
  2000;

const CONTACT_REQUEST_EVENT =
  "farre-contact-requests-updated";

interface ContactRequest {
  id: number;
  name: string;
  company?: string | null;
  email: string;
  phone: string;
  service: string;
  message: string;
  is_read: number | boolean;
  created_at: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

type FilterValue =
  | "all"
  | "unread"
  | "read";

type DateFilterValue =
  | "today"
  | "week"
  | "month"
  | "custom"
  | "all";

const serviceLabels: Record<
  string,
  string
> = {
  inspection:
    "Inspection sous-marine",

  maintenance:
    "Maintenance et nettoyage",

  soudure:
    "Soudure et découpage",

  hydraulique:
    "Travaux hydrauliques",

  portuaire:
    "Travaux portuaires",

  assistance:
    "Assistance technique",
};

function formatDateInput(
  date: Date
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function startOfDay(
  date: Date
) {
  const result =
    new Date(date);

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
}

function endOfDay(
  date: Date
) {
  const result =
    new Date(date);

  result.setHours(
    23,
    59,
    59,
    999
  );

  return result;
}

function startOfCurrentWeek() {
  const now =
    new Date();

  const day =
    now.getDay();

  const distanceFromMonday =
    day === 0
      ? 6
      : day - 1;

  const start =
    new Date(now);

  start.setDate(
    now.getDate() -
      distanceFromMonday
  );

  return startOfDay(start);
}

function endOfCurrentWeek() {
  const start =
    startOfCurrentWeek();

  const end =
    new Date(start);

  end.setDate(
    start.getDate() + 6
  );

  return endOfDay(end);
}

export default function AdminDemandesPage() {
  const router = useRouter();

  const [requests, setRequests] =
    useState<ContactRequest[]>([]);

  const [
    selectedRequest,
    setSelectedRequest,
  ] = useState<ContactRequest | null>(
    null
  );

  const [
    requestToDelete,
    setRequestToDelete,
  ] = useState<ContactRequest | null>(
    null
  );

  const [loading, setLoading] =
    useState(true);

  const [
    autoRefreshing,
    setAutoRefreshing,
  ] = useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState<number | null>(null);

  const [
    updatingId,
    setUpdatingId,
  ] = useState<number | null>(null);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<FilterValue>("all");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    itemsPerPage,
    setItemsPerPage,
  ] = useState(10);

  const [
    dateFilter,
    setDateFilter,
  ] = useState<DateFilterValue>(
    "week"
  );

  const [
    startDate,
    setStartDate,
  ] = useState(
    formatDateInput(
      startOfCurrentWeek()
    )
  );

  const [
    endDate,
    setEndDate,
  ] = useState(
    formatDateInput(
      endOfCurrentWeek()
    )
  );

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  function redirectIfUnauthorized(
    response: Response
  ) {
    if (response.status !== 401) {
      return false;
    }

    router.replace(
      "/admin/connexion"
    );

    router.refresh();

    return true;
  }

  const loadRequests =
    useCallback(
      async (
        silent = false
      ) => {
        if (silent) {
          setAutoRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        try {
        const response = await fetch(
          `${API_URL}/api/contact-requests`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",

            headers: {
              Accept:
                "application/json",
            },
          }
        );

        if (
          redirectIfUnauthorized(
            response
          )
        ) {
          return;
        }

        const result: ApiResponse<
          ContactRequest[]
        > = await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Impossible de charger les demandes."
          );
        }

        const data =
          Array.isArray(result.data)
            ? result.data
            : [];

        setRequests(data);

        setSelectedRequest(
          (previous) => {
            if (!previous) {
              return null;
            }

            return (
              data.find(
                (item) =>
                  item.id ===
                  previous.id
              ) || null
            );
          }
        );
        } catch (exception) {
          if (!silent) {
            setError(
              exception instanceof Error
                ? exception.message
                : "Impossible de charger les demandes."
            );
          }
        } finally {
          if (silent) {
            setAutoRefreshing(false);
          } else {
            setLoading(false);
          }
        }
      },
      [router]
    );

  useEffect(() => {
    loadRequests(false);

    const intervalId =
      window.setInterval(
        () => {
          loadRequests(true);
        },
        REQUEST_REFRESH_INTERVAL
      );

    const handleContactRequestUpdate =
      () => {
        loadRequests(true);
      };

    window.addEventListener(
      CONTACT_REQUEST_EVENT,
      handleContactRequestUpdate
    );

    return () => {
      window.clearInterval(
        intervalId
      );

      window.removeEventListener(
        CONTACT_REQUEST_EVENT,
        handleContactRequestUpdate
      );
    };
  }, [loadRequests]);

  const dateFilteredRequests =
    useMemo(() => {
      if (
        dateFilter === "all"
      ) {
        return requests;
      }

      let rangeStart: Date;
      let rangeEnd: Date;

      const now =
        new Date();

      if (
        dateFilter === "today"
      ) {
        rangeStart =
          startOfDay(now);

        rangeEnd =
          endOfDay(now);
      } else if (
        dateFilter === "week"
      ) {
        rangeStart =
          startOfCurrentWeek();

        rangeEnd =
          endOfCurrentWeek();
      } else if (
        dateFilter === "month"
      ) {
        rangeStart =
          new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
            0,
            0,
            0,
            0
          );

        rangeEnd =
          new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59,
            999
          );
      } else {
        const parsedStart =
          startDate
            ? new Date(
                `${startDate}T00:00:00`
              )
            : null;

        const parsedEnd =
          endDate
            ? new Date(
                `${endDate}T23:59:59.999`
              )
            : null;

        if (
          parsedStart &&
          parsedEnd &&
          parsedStart >
            parsedEnd
        ) {
          return [];
        }

        rangeStart =
          parsedStart ||
          new Date(
            "1970-01-01T00:00:00"
          );

        rangeEnd =
          parsedEnd ||
          new Date(
            "2999-12-31T23:59:59"
          );
      }

      return requests.filter(
        (request) => {
          const createdAt =
            new Date(
              request.created_at
            );

          if (
            Number.isNaN(
              createdAt.getTime()
            )
          ) {
            return false;
          }

          return (
            createdAt >=
              rangeStart &&
            createdAt <=
              rangeEnd
          );
        }
      );
    }, [
      requests,
      dateFilter,
      startDate,
      endDate,
    ]);

  const unreadCount =
    useMemo(
      () =>
        dateFilteredRequests.filter(
          (request) =>
            !Boolean(
              request.is_read
            )
        ).length,
      [dateFilteredRequests]
    );

  const filteredRequests =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return dateFilteredRequests.filter(
        (request) => {
          const isRead =
            Boolean(
              request.is_read
            );

          if (
            filter === "unread" &&
            isRead
          ) {
            return false;
          }

          if (
            filter === "read" &&
            !isRead
          ) {
            return false;
          }

          if (
            !normalizedSearch
          ) {
            return true;
          }

          const service =
            serviceLabels[
              request.service
            ] ||
            request.service;

          return [
            request.name,
            request.company || "",
            request.email,
            request.phone,
            service,
            request.message,
          ].some((value) =>
            value
              .toLowerCase()
              .includes(
                normalizedSearch
              )
          );
        }
      );
    }, [
      dateFilteredRequests,
      search,
      filter,
    ]);

  const totalPages =
    useMemo(() => {
      return Math.max(
        1,
        Math.ceil(
          filteredRequests.length /
            itemsPerPage
        )
      );
    }, [
      filteredRequests.length,
      itemsPerPage,
    ]);

  const paginatedRequests =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        itemsPerPage;

      return filteredRequests.slice(
        startIndex,
        startIndex +
          itemsPerPage
      );
    }, [
      filteredRequests,
      currentPage,
      itemsPerPage,
    ]);

  const paginationPages =
    useMemo(() => {
      const pages: number[] =
        [];

      const startPage =
        Math.max(
          1,
          currentPage - 2
        );

      const endPage =
        Math.min(
          totalPages,
          startPage + 4
        );

      const adjustedStart =
        Math.max(
          1,
          endPage - 4
        );

      for (
        let page =
          adjustedStart;
        page <= endPage;
        page += 1
      ) {
        pages.push(page);
      }

      return pages;
    }, [
      currentPage,
      totalPages,
    ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    filter,
    dateFilter,
    startDate,
    endDate,
    itemsPerPage,
  ]);

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  function notifyContactRequestsUpdated() {
    window.dispatchEvent(
      new Event(
        CONTACT_REQUEST_EVENT
      )
    );

    try {
      localStorage.setItem(
        CONTACT_REQUEST_EVENT,
        String(Date.now())
      );
    } catch {
      // Le stockage local peut être indisponible.
    }
  }

  async function updateReadStatus(
    request: ContactRequest,
    isRead: boolean
  ) {
    setUpdatingId(request.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/api/contact-requests/${request.id}/read`,
        {
          method: "PATCH",
          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify({
            isRead,
          }),
        }
      );

      if (
        redirectIfUnauthorized(
          response
        )
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
            "Impossible de modifier le statut."
        );
      }

      setRequests(
        (previous) =>
          previous.map(
            (item) =>
              item.id ===
              request.id
                ? {
                    ...item,
                    is_read:
                      isRead,
                  }
                : item
          )
      );

      setSelectedRequest(
        (previous) =>
          previous?.id ===
          request.id
            ? {
                ...previous,
                is_read:
                  isRead,
              }
            : previous
      );

      setSuccess(
        result.message ||
          (isRead
            ? "Demande marquée comme lue."
            : "Demande marquée comme non lue.")
      );

      notifyContactRequestsUpdated();
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Impossible de modifier le statut."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function openRequest(
    request: ContactRequest
  ) {
    setSelectedRequest(
      request
    );

    if (
      !Boolean(
        request.is_read
      )
    ) {
      await updateReadStatus(
        request,
        true
      );
    }
  }

  async function deleteRequest(
    request: ContactRequest
  ) {
    setDeletingId(request.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/api/contact-requests/${request.id}`,
        {
          method: "DELETE",
          credentials: "include",

          headers: {
            Accept:
              "application/json",
          },
        }
      );

      if (
        redirectIfUnauthorized(
          response
        )
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
            "Impossible de supprimer la demande."
        );
      }

      setRequests(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !==
              request.id
          )
      );

      if (
        selectedRequest?.id ===
        request.id
      ) {
        setSelectedRequest(
          null
        );
      }

      setRequestToDelete(
        null
      );

      setSuccess(
        result.message ||
          "Demande supprimée avec succès."
      );

      notifyContactRequestsUpdated();
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Impossible de supprimer la demande."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(
    value: string
  ) {
    const date =
      new Date(value);

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
        dateStyle:
          "medium",

        timeStyle:
          "short",
      }
    ).format(date);
  }

  function getInitials(
    name: string
  ) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part
          .charAt(0)
          .toUpperCase()
      )
      .join("");
  }

  function getServiceLabel(
    service: string
  ) {
    return (
      serviceLabels[
        service
      ] || service
    );
  }

  function createReplyLink(
    request: ContactRequest
  ) {
    const service =
      getServiceLabel(
        request.service
      );

    const email =
      encodeURIComponent(
        request.email
      );

    const subject =
      encodeURIComponent(
        `Réponse Farre Service - ${service}`
      );

    const body =
      encodeURIComponent(
        `Bonjour ${request.name},

Nous vous remercions pour votre demande concernant : ${service}.

Cordialement,
EURL Farre Service`
      );

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
  }

  return (
    <main className="admin-page">
      <div className="admin-page-container">
        <section className="admin-page-heading">
          <div>
            <span className="admin-page-kicker">
              <Inbox size={16} />
              Boîte de réception
            </span>

            <h1>
              Demandes clients
            </h1>

            <p>
              Consultez et gérez les
              demandes envoyées depuis
              le formulaire de contact.
            </p>
          </div>

          <button
            type="button"
            className="admin-settings-refresh"
            onClick={() =>
              loadRequests(false)
            }
            disabled={
              loading ||
              autoRefreshing
            }
          >
            <RefreshCw
              size={17}
              className={
                loading ||
                autoRefreshing
                  ? "admin-spin"
                  : ""
              }
            />

            {autoRefreshing
              ? "Synchronisation..."
              : "Actualiser"}
          </button>
        </section>

        {error && (
          <div className="admin-settings-alert admin-settings-alert-error">
            <AlertCircle
              size={19}
            />

            <span>
              {error}
            </span>
          </div>
        )}

        {success && (
          <div className="admin-settings-alert admin-settings-alert-success">
            <CheckCircle2
              size={19}
            />

            <span>
              {success}
            </span>
          </div>
        )}

        <section className="admin-request-stats">
          <article className="admin-request-stat">
            <span>
              <Inbox
                size={21}
              />
            </span>

            <div>
              <strong>
                {
                  dateFilteredRequests.length
                }
              </strong>

              <small>
                Demandes reçues
              </small>
            </div>
          </article>

          <article className="admin-request-stat">
            <span>
              <Mail
                size={21}
              />
            </span>

            <div>
              <strong>
                {unreadCount}
              </strong>

              <small>
                Non lues
              </small>
            </div>
          </article>

          <article className="admin-request-stat">
            <span>
              <MailOpen
                size={21}
              />
            </span>

            <div>
              <strong>
                {dateFilteredRequests.length -
                  unreadCount}
              </strong>

              <small>
                Déjà consultées
              </small>
            </div>
          </article>
        </section>

        <section className="admin-requests-card admin-card">
          <div className="admin-requests-toolbar">
            <div className="admin-date-filter-panel">
              <div className="admin-date-filter-heading">
                <CalendarRange
                  size={18}
                />

                <div>
                  <strong>
                    Filtrer par date
                  </strong>

                  <span>
                    Par défaut : semaine en cours
                  </span>
                </div>
              </div>

              <div className="admin-date-filter-buttons">
                <button
                  type="button"
                  className={
                    dateFilter ===
                    "today"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setDateFilter(
                      "today"
                    )
                  }
                >
                  Aujourd’hui
                </button>

                <button
                  type="button"
                  className={
                    dateFilter ===
                    "week"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setDateFilter(
                      "week"
                    )
                  }
                >
                  Cette semaine
                </button>

                <button
                  type="button"
                  className={
                    dateFilter ===
                    "month"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setDateFilter(
                      "month"
                    )
                  }
                >
                  Ce mois
                </button>

                <button
                  type="button"
                  className={
                    dateFilter ===
                    "all"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setDateFilter(
                      "all"
                    )
                  }
                >
                  Toutes les dates
                </button>

                <button
                  type="button"
                  className={
                    dateFilter ===
                    "custom"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setDateFilter(
                      "custom"
                    )
                  }
                >
                  Période personnalisée
                </button>
              </div>

              {dateFilter ===
                "custom" && (
                <div className="admin-custom-date-range">
                  <label>
                    <span>
                      Date de début
                    </span>

                    <input
                      type="date"
                      value={
                        startDate
                      }
                      onChange={(
                        event
                      ) =>
                        setStartDate(
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </label>

                  <label>
                    <span>
                      Date de fin
                    </span>

                    <input
                      type="date"
                      value={
                        endDate
                      }
                      min={
                        startDate ||
                        undefined
                      }
                      onChange={(
                        event
                      ) =>
                        setEndDate(
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="admin-requests-toolbar-bottom">
              <div className="admin-requests-search">
              <Search
                size={18}
              />

              <input
                type="search"
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event
                      .target
                      .value
                  )
                }
                placeholder="Rechercher par nom, entreprise, email, téléphone ou service..."
              />
            </div>

            <div className="admin-request-filters">
              <button
                type="button"
                className={
                  filter ===
                  "all"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(
                    "all"
                  )
                }
              >
                Toutes
              </button>

              <button
                type="button"
                className={
                  filter ===
                  "unread"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(
                    "unread"
                  )
                }
              >
                Non lues (
                {unreadCount})
              </button>

              <button
                type="button"
                className={
                  filter ===
                  "read"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(
                    "read"
                  )
                }
              >
                Lues
              </button>
            </div>
            </div>
          </div>

          {loading ? (
            <div className="admin-requests-state">
              <Loader2
                size={30}
                className="admin-spin"
              />

              <h2>
                Chargement des
                demandes
              </h2>

              <p>
                Veuillez patienter.
              </p>
            </div>
          ) : filteredRequests.length ===
            0 ? (
            <div className="admin-requests-state">
              <Inbox
                size={38}
              />

              <h2>
                Aucune demande
                trouvée
              </h2>

              <p>
                Aucun message ne
                correspond à votre
                recherche ou à la
                période sélectionnée.
              </p>
            </div>
          ) : (
            <div className="admin-requests-list">
              {paginatedRequests.map(
                (request) => {
                  const isRead =
                    Boolean(
                      request.is_read
                    );

                  return (
                    <article
                      key={
                        request.id
                      }
                      className={`admin-request-row ${
                        !isRead
                          ? "unread"
                          : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="admin-request-open"
                        onClick={() =>
                          openRequest(
                            request
                          )
                        }
                      >
                        <span className="admin-request-avatar">
                          {getInitials(
                            request.name
                          )}
                        </span>

                        <span className="admin-request-summary">
                          <span className="admin-request-summary-top">
                            <strong>
                              {
                                request.name
                              }
                            </strong>

                            {!isRead && (
                              <span className="admin-request-new-badge">
                                Nouveau
                              </span>
                            )}
                          </span>

                          <span className="admin-request-subject">
                            {getServiceLabel(
                              request.service
                            )}
                          </span>

                          <span className="admin-request-excerpt">
                            {
                              request.message
                            }
                          </span>
                        </span>

                        <span className="admin-request-date">
                          <Clock3
                            size={
                              14
                            }
                          />

                          {formatDate(
                            request.created_at
                          )}
                        </span>
                      </button>

                      <div className="admin-request-row-actions">
                        <a
                          href={createReplyLink(
                            request
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-request-reply"
                        >
                          <Reply
                            size={
                              16
                            }
                          />

                          Répondre
                        </a>

                        <button
                          type="button"
                          className="admin-request-delete"
                          onClick={() =>
                            setRequestToDelete(
                              request
                            )
                          }
                          aria-label="Supprimer la demande"
                        >
                          <Trash2
                            size={
                              16
                            }
                          />
                        </button>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}

          {!loading &&
            filteredRequests.length >
              0 && (
              <div className="admin-pagination">
                <div className="admin-pagination-info">
                  <span>
                    Affichage de{" "}
                    <strong>
                      {(currentPage -
                        1) *
                        itemsPerPage +
                        1}
                    </strong>{" "}
                    à{" "}
                    <strong>
                      {Math.min(
                        currentPage *
                          itemsPerPage,
                        filteredRequests.length
                      )}
                    </strong>{" "}
                    sur{" "}
                    <strong>
                      {
                        filteredRequests.length
                      }
                    </strong>{" "}
                    demandes
                  </span>

                  <label>
                    <span>
                      Par page
                    </span>

                    <select
                      value={
                        itemsPerPage
                      }
                      onChange={(
                        event
                      ) =>
                        setItemsPerPage(
                          Number(
                            event
                              .target
                              .value
                          )
                        )
                      }
                    >
                      <option value={5}>
                        5
                      </option>

                      <option value={10}>
                        10
                      </option>

                      <option value={20}>
                        20
                      </option>

                      <option value={50}>
                        50
                      </option>
                    </select>
                  </label>
                </div>

                <div className="admin-pagination-controls">
                  <button
                    type="button"
                    className="admin-pagination-arrow"
                    onClick={() =>
                      setCurrentPage(
                        (previous) =>
                          Math.max(
                            1,
                            previous -
                              1
                          )
                      )
                    }
                    disabled={
                      currentPage ===
                      1
                    }
                    aria-label="Page précédente"
                  >
                    <ChevronLeft
                      size={18}
                    />

                    <span>
                      Précédent
                    </span>
                  </button>

                  <div className="admin-pagination-pages">
                    {paginationPages.map(
                      (page) => (
                        <button
                          key={
                            page
                          }
                          type="button"
                          className={
                            currentPage ===
                            page
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            setCurrentPage(
                              page
                            )
                          }
                          aria-label={`Page ${page}`}
                          aria-current={
                            currentPage ===
                            page
                              ? "page"
                              : undefined
                          }
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    className="admin-pagination-arrow"
                    onClick={() =>
                      setCurrentPage(
                        (previous) =>
                          Math.min(
                            totalPages,
                            previous +
                              1
                          )
                      )
                    }
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    aria-label="Page suivante"
                  >
                    <span>
                      Suivant
                    </span>

                    <ChevronRight
                      size={18}
                    />
                  </button>
                </div>
              </div>
            )}
        </section>
      </div>

      {selectedRequest && (
        <div
          className="admin-request-modal-backdrop"
          role="presentation"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedRequest(
                null
              );
            }
          }}
        >
          <section
            className="admin-request-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-modal-title"
          >
            <button
              type="button"
              className="admin-request-modal-close"
              onClick={() =>
                setSelectedRequest(
                  null
                )
              }
              aria-label="Fermer"
            >
              <X size={21} />
            </button>

            <div className="admin-request-modal-header">
              <span className="admin-request-modal-avatar">
                {getInitials(
                  selectedRequest.name
                )}
              </span>

              <div>
                <span>
                  Demande reçue
                </span>

                <h2 id="request-modal-title">
                  {getServiceLabel(
                    selectedRequest.service
                  )}
                </h2>

                <p>
                  {formatDate(
                    selectedRequest.created_at
                  )}
                </p>
              </div>
            </div>

            <div className="admin-request-contact-grid">
              <div>
                <UserRound
                  size={17}
                />

                <span>
                  <small>
                    Nom
                  </small>

                  <strong>
                    {
                      selectedRequest.name
                    }
                  </strong>
                </span>
              </div>

              <div>
                <Mail
                  size={17}
                />

                <span>
                  <small>
                    Email
                  </small>

                  <a
                    href={`mailto:${selectedRequest.email}`}
                  >
                    {
                      selectedRequest.email
                    }
                  </a>
                </span>
              </div>

              <div>
                <Phone
                  size={17}
                />

                <span>
                  <small>
                    Téléphone
                  </small>

                  <a
                    href={`tel:${selectedRequest.phone}`}
                  >
                    {
                      selectedRequest.phone
                    }
                  </a>
                </span>
              </div>

              <div>
                <Wrench
                  size={17}
                />

                <span>
                  <small>
                    Service
                  </small>

                  <strong>
                    {getServiceLabel(
                      selectedRequest.service
                    )}
                  </strong>
                </span>
              </div>

              {selectedRequest.company && (
                <div>
                  <Building2
                    size={17}
                  />

                  <span>
                    <small>
                      Entreprise
                    </small>

                    <strong>
                      {
                        selectedRequest.company
                      }
                    </strong>
                  </span>
                </div>
              )}
            </div>

            <div className="admin-request-message">
              <span>
                <MessageSquare
                  size={18}
                />

                Message
              </span>

              <p>
                {
                  selectedRequest.message
                }
              </p>
            </div>

            <div className="admin-request-modal-actions">
              <button
                type="button"
                className="admin-request-status-button"
                onClick={() =>
                  updateReadStatus(
                    selectedRequest,
                    !Boolean(
                      selectedRequest.is_read
                    )
                  )
                }
                disabled={
                  updatingId ===
                  selectedRequest.id
                }
              >
                {updatingId ===
                selectedRequest.id ? (
                  <Loader2
                    size={17}
                    className="admin-spin"
                  />
                ) : Boolean(
                    selectedRequest.is_read
                  ) ? (
                  <Mail
                    size={17}
                  />
                ) : (
                  <MailOpen
                    size={17}
                  />
                )}

                {Boolean(
                  selectedRequest.is_read
                )
                  ? "Marquer non lue"
                  : "Marquer comme lue"}
              </button>

              <a
                href={createReplyLink(
                  selectedRequest
                )}
                target="_blank"
                rel="noreferrer"
                className="admin-request-primary-action"
              >
                <Reply
                  size={17}
                />

                Répondre par Gmail
              </a>
            </div>
          </section>
        </div>
      )}

      {requestToDelete && (
        <div
          className="admin-delete-modal-backdrop"
          role="presentation"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
                event.currentTarget &&
              deletingId ===
                null
            ) {
              setRequestToDelete(
                null
              );
            }
          }}
        >
          <section
            className="admin-delete-modal"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="admin-delete-modal-close"
              onClick={() =>
                setRequestToDelete(
                  null
                )
              }
              disabled={
                deletingId ===
                requestToDelete.id
              }
              aria-label="Fermer"
            >
              <X size={20} />
            </button>

            <div className="admin-delete-modal-icon">
              <Trash2
                size={30}
              />
            </div>

            <span className="admin-delete-modal-kicker">
              Confirmation
            </span>

            <h2>
              Supprimer cette
              demande ?
            </h2>

            <p className="admin-delete-modal-description">
              La demande de{" "}
              <strong>
                {
                  requestToDelete.name
                }
              </strong>{" "}
              sera définitivement
              supprimée.
            </p>

            <div className="admin-delete-modal-actions">
              <button
                type="button"
                className="admin-delete-cancel"
                onClick={() =>
                  setRequestToDelete(
                    null
                  )
                }
                disabled={
                  deletingId ===
                  requestToDelete.id
                }
              >
                Annuler
              </button>

              <button
                type="button"
                className="admin-delete-confirm"
                onClick={() =>
                  deleteRequest(
                    requestToDelete
                  )
                }
                disabled={
                  deletingId ===
                  requestToDelete.id
                }
              >
                {deletingId ===
                requestToDelete.id ? (
                  <>
                    <Loader2
                      size={18}
                      className="admin-spin"
                    />

                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2
                      size={18}
                    />

                    Supprimer
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
