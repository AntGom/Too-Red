/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/UseAuth";
import { Global } from "../../../helpers/Global";
import PublicationList from "../../publication/PublicationList";
import HeaderProfile from "./HeaderProfile";
import { TagIcon, DocumentTextIcon } from "@heroicons/react/24/solid";

const Profile = () => {
  const { auth } = useAuth();
  const [user, setUser] = useState({});
  const [iFollow, setIFollow] = useState(false);
  const [counters, setCounters] = useState({});
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [activeTab, setActiveTab] = useState("publications");
  const [taggedPublications, setTaggedPublications] = useState([]);
  const [taggedPage, setTaggedPage] = useState(1);
  const [moreTagged, setMoreTagged] = useState(true);
  const [loadingTagged, setLoadingTagged] = useState(false);
  const params = useParams();
  const token = localStorage.getItem("token");

  const getCounters = async () => {
    const response = await fetch(
      Global.url + "user/counters/" + params.userId,
      {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: token },
      }
    );
    const data = await response.json();
    if (data.following) setCounters(data);
  };

  const getDataUser = async () => {
    const response = await fetch(Global.url + "user/profile/" + params.userId, {
      headers: { Authorization: token },
    });
    const data = await response.json();
    setUser(data.user);
    setIFollow(!!data.following && !!data.following._id);
  };

  const getPublications = async (actualPage = 1, newProfile = false) => {
    const response = await fetch(
      Global.url + "publication/user/" + params.userId + "/" + actualPage,
      {
        method: "GET",
        headers: { Authorization: token },
      }
    );
    const data = await response.json();

    if (data.status === "success") {
      if (newProfile) {
        setPublications(data.publications);
      } else {
        setPublications((prevPublications) => [
          ...prevPublications,
          ...data.publications,
        ]);
      }

      setMore(data.totalPages > actualPage);
    }
  };

  const getTaggedPublications = async (actualPage = 1, newProfile = false) => {
    setLoadingTagged(true);
    try {
      const response = await fetch(
        `${Global.url}publication/tagged/${params.userId}/${actualPage}`,
        {
          method: "GET",
          headers: { Authorization: token },
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        if (newProfile) {
          setTaggedPublications(data.publications);
        } else {
          setTaggedPublications((prev) => [...prev, ...data.publications]);
        }

        setMoreTagged(data.totalPages > actualPage);
      }
    } catch (error) {
      console.error("Error al obtener publicaciones etiquetadas:", error);
    } finally {
      setLoadingTagged(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setTaggedPage(1);
    setActiveTab("publications");
    getDataUser();
    getCounters();
    getPublications(1, true);
    getTaggedPublications(1, true);
  }, [params.userId]);

  // Evento de nueva publicación
  useEffect(() => {
    const handleNewPublication = (event) => {
      if (event.detail.userId === params.userId && page === 1) {
        getPublications(1, true);
        getCounters();
      }
    };

    window.addEventListener("publicationCreated", handleNewPublication);
    return () => {
      window.removeEventListener("publicationCreated", handleNewPublication);
    };
  }, [params.userId, page]);

  // Evento de eliminación de publicación
  useEffect(() => {
    const handleDeletedPublication = (event) => {
      if (event.detail.userId === params.userId && page === 1) {
        getPublications(1, true);
        getCounters();
      }
    };

    window.addEventListener("publicationDeleted", handleDeletedPublication);
    return () => {
      window.removeEventListener(
        "publicationDeleted",
        handleDeletedPublication
      );
    };
  }, [params.userId, page]);

  if (!user?.name) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-white"
        role="status"
        aria-live="polite"
      >
        Cargando...
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto md:px-8">
      <HeaderProfile
        user={user}
        auth={auth}
        counters={counters}
        iFollow={iFollow}
        setIFollow={setIFollow}
        token={token}
      />

      {/* Pestañas de navegación */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "publications"
              ? "border-b-2 border-red-500 text-red-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("publications")}
        >
          Publicaciones
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            activeTab === "tagged"
              ? "border-b-2 border-red-500 text-red-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("tagged")}
        >
          <TagIcon className="w-4 h-4 mr-1" />
          Etiquetas
        </button>
      </div>

      {activeTab === "publications" && (
        <>
          {publications.length === 0 ? (
            <div className="text-center py-10">
              <DocumentTextIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                Sin publicaciones
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {user._id === auth._id
                  ? "Todavía no has publicado nada."
                  : "Este usuario aún no ha publicado nada."}
              </p>
            </div>
          ) : (
            <PublicationList
              publications={publications}
              page={page}
              setPage={setPage}
              more={more}
              setMore={setMore}
              getPublications={getPublications}
            />
          )}
        </>
      )}

      {activeTab === "tagged" && (
        <>
          {taggedPublications.length === 0 ? (
            <div className="text-center py-10">
              <TagIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                Sin etiquetas
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                No hay publicaciones donde{" "}
                {user._id === auth._id ? "estés" : "esté"} etiquetado.
              </p>
            </div>
          ) : (
            <PublicationList
              publications={taggedPublications}
              page={taggedPage}
              setPage={setTaggedPage}
              more={moreTagged}
              setMore={setMoreTagged}
              getPublications={getTaggedPublications}
            />
          )}
        </>
      )}
    </section>
  );
};

export default Profile;
