/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import PublicationList from "../publication/PublicationList";
import { useParams } from "react-router-dom";
import { DocumentIcon } from "@heroicons/react/24/solid";

const MyPublications = () => {
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const params = useParams();
  const token = localStorage.getItem("token");

  const getMyPublications = async (actualPage = 1) => {
    const response = await fetch(
      Global.url + "publication/user/" + params.userId + "/" + actualPage,
      {
        method: "GET",
        headers: { Authorization: token },
      }
    );
    const data = await response.json();
    if (data.status === "success") {
      setPublications((prev) =>
        actualPage === 1 ? data.publications : [...prev, ...data.publications]
      );
      setMore(data.totalPages > actualPage);
    }
  };

  useEffect(() => {
    setPage(1);
    getMyPublications(1);
  }, [params.userId]);

  useEffect(() => {
    const handleNewPublication = (event) => {
      // Si la publicación es del usuario que estamos viendo
      if (event.detail.userId === params.userId) {
        // Recargar las publicaciones
        getMyPublications(1);
      }
    };

    window.addEventListener("publicationCreated", handleNewPublication);

    return () => {
      window.removeEventListener("publicationCreated", handleNewPublication);
    };
  }, [params.userId]);

  return (
    <section className="max-w-7xl sm:px-2 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Mis Publicaciones</h1>

      {publications.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-20">
          <DocumentIcon className="w-16 h-16 mb-4 text-gray-400" />
          <p className="text-lg">No hay publicaciones aún</p>
          <span className="text-sm text-gray-400">¡Vuelve pronto!</span>
        </div>
      ) : (
        <PublicationList
          publications={publications}
          page={page}
          setPage={setPage}
          more={more}
          setMore={setMore}
          getPublications={getMyPublications}
        />
      )}
    </section>
  );
};

export default MyPublications;
