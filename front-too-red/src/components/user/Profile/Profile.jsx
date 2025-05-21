/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/UseAuth";
import { Global } from "../../../helpers/Global";
import PublicationList from "../../publication/PublicationList";
import HeaderProfile from "./HeaderProfile";

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

  useEffect(() => {
    setPage(1);
    getDataUser();
    getCounters();
    getPublications(1, true);
  }, [params.userId]);

  // Escuchar el evento de nueva publicación
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

  // Escuchar evento de eliminación de publicación
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
