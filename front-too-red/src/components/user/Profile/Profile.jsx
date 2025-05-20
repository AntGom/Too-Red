/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/UseAuth";
import { Global } from "../../../helpers/Global";
import PublicationList from "../../publication/PublicationList";
import HeaderProfile from "./HeaderProfile";
import { getCachedData, cacheData } from "../../../helpers/Cache";

const Profile = () => {
  const { auth } = useAuth();
  const [user, setUser] = useState({});
  const [iFollow, setIFollow] = useState(false);
  const [counters, setCounters] = useState({});
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const params = useParams();
  const token = localStorage.getItem("token");

  const getCounters = async () => {
    // Intentar cargar contadores desde caché
    const cacheKey = `counters_${params.userId}`;
    const cachedCounters = getCachedData(cacheKey);
    
    if (cachedCounters) {
      setCounters(cachedCounters);
      return;
    }

    // Si no hay caché, hacer petición
    const response = await fetch(
      Global.url + "user/counters/" + params.userId,
      {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: token },
      }
    );
    const data = await response.json();
    if (data.following) {
      setCounters(data);
      // Guardar en caché por 2 minutos
      cacheData(cacheKey, data, 2);
    }
  };

  const getDataUser = async () => {
    // Intentar cargar perfil desde caché
    const cacheKey = `profile_${params.userId}`;
    const cachedProfile = getCachedData(cacheKey);
    
    if (cachedProfile) {
      setUser(cachedProfile.user);
      setIFollow(!!cachedProfile.following && !!cachedProfile.following._id);
      return;
    }

    // Si no hay caché, hacer petición
    const response = await fetch(Global.url + "user/profile/" + params.userId, {
      headers: { Authorization: token },
    });
    const data = await response.json();
    
    // Guardar en caché por 5 minutos
    cacheData(cacheKey, data, 5);
    
    setUser(data.user);
    setIFollow(!!data.following && !!data.following._id);
  };

  const getPublications = async (actualPage = 1, newProfile = false) => {
    // Si cargamos la primera página o es un perfil nuevo, intentar usar caché
    if (actualPage === 1) {
      const cacheKey = `user_publications_${params.userId}_page1`;
      const cachedPublications = getCachedData(cacheKey);
      
      if (cachedPublications && newProfile) {
        setPublications(cachedPublications.publications);
        setMore(cachedPublications.totalPages > actualPage);
        return;
      }
    }
    
    // Si no hay caché o es otra página, hacer petición
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
        // Guardar primera página en caché por 2 minutos
        if (actualPage === 1) {
          cacheData(`user_publications_${params.userId}_page1`, data, 2);
        }
      } else {
        setPublications((prevPublications) => [
          ...prevPublications,
          ...data.publications,
        ]);
      }

      setMore(data.totalPages > actualPage);
    }
  };

  useEffect(() => {
    setPage(1);
    getDataUser();
    getCounters();
    getPublications(1, true);
  }, [params.userId]);

  // Escuchar el evento de nueva publicación
  useEffect(() => {
    const handleNewPublication = (event) => {
      // Si la publicación es del usuario que estamos viendo
      if (event.detail.userId === params.userId) {
        // Recargar las publicaciones
        getPublications(1, true);
      }
    };
    
    window.addEventListener('publicationCreated', handleNewPublication);
    
    return () => {
      window.removeEventListener('publicationCreated', handleNewPublication);
    };
  }, [params.userId]);

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeaderProfile
        user={user}
        auth={auth}
        counters={counters}
        iFollow={iFollow}
        setIFollow={setIFollow}
        token={token}
      />
      <PublicationList
        publications={publications}
        page={page}
        setPage={setPage}
        more={more}
        setMore={setMore}
        getPublications={getPublications}
      />
    </section>
  );
};

export default Profile;