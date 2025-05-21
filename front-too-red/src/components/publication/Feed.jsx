/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import PublicationList from "../publication/PublicationList";
import { ArrowPathIcon, DocumentIcon } from "@heroicons/react/24/solid";
import { getCachedData, cacheData } from "../../helpers/Cache";

const Feed = () => {
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    getPublications(page, page === 1);
  }, [page]);

  const getPublications = async (actualPage = 1, showNews = false) => {
    let shouldRefresh = false;

    if (showNews) {
      setPublications([]);
      setPage(1);
      actualPage = 1;
      setRefreshing(true);
      shouldRefresh = true;
    }

    try {
      const cacheKey = `feed_publications_page_${actualPage}`;
      const cachedFeed = getCachedData(cacheKey);

      if (cachedFeed && !showNews && actualPage === 1) {
        setPublications(cachedFeed.publications);
        setMore(cachedFeed.hasNextPage);
        return;
      }

      const request = await fetch(
        `${Global.url}publication/feed/${actualPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const data = await request.json();

      if (data.status === "success") {
        const newPublications =
          actualPage === 1
            ? data.publications
            : [...publications, ...data.publications];

        setPublications(newPublications);
        setMore(data.hasNextPage);

        if (actualPage === 1) {
          cacheData(cacheKey, data, 2);
        }
      } else {
        console.error("Error en la respuesta de la API:", data);
      }
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
    } finally {
      if (shouldRefresh) setRefreshing(false);
    }
  };

  return (
    <div className="max-w-7xl md:px-6 lg:px-8">
      <header className="flex justify-end mb-4 md:-mt-7">
        <button
          onClick={() => getPublications(1, true)}
          className="rounded-full hover:bg-gray-200 transition"
          title="Mostrar nuevas"
          disabled={refreshing}
        >
          <ArrowPathIcon
            className={`h-6 w-6 text-red-600 ${
              refreshing ? "animate-spin" : ""
            }`}
          />
        </button>
      </header>

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
          getPublications={getPublications}
        />
      )}
    </div>
  );
};

export default Feed;
