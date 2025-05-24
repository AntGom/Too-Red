/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Global } from "../../helpers/Global";
import PublicationList from "../publication/PublicationList";
import { TagIcon } from "@heroicons/react/24/solid";

const TaggedPublications = () => {
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const token = localStorage.getItem("token");
  
  const getTaggedPublications = async (actualPage = 1, refresh = false) => {
    setLoading(true);
    
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
        if (refresh) {
          setPublications(data.publications);
        } else {
          setPublications((prev) => [...prev, ...data.publications]);
        }
        
        setMore(data.hasNextPage);
      }
    } catch (error) {
      console.error("Error al obtener publicaciones etiquetadas:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getTaggedPublications(1, true);
  }, [params.userId]);
  
  return (
    <section className="max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <TagIcon className="h-6 w-6 mr-2 text-red-600" />
        Publicaciones en las que estás etiquetado
      </h1>
      
      {publications.length === 0 ? (
        <div className="text-center py-10">
          {loading ? (
            <div className="spinner mx-auto"></div>
          ) : (
            <>
              <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No hay etiquetas</h3>
              <p className="mt-2 text-sm text-gray-500">
                No te han etiquetado en ninguna publicación todavía.
              </p>
            </>
          )}
        </div>
      ) : (
        <PublicationList
          publications={publications}
          page={page}
          setPage={setPage}
          more={more}
          setMore={setMore}
          getPublications={getTaggedPublications}
        />
      )}
    </section>
  );
};

export default TaggedPublications;