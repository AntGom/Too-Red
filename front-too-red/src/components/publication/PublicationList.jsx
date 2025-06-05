import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import PublicationCard from "./PublicationCard/PublicationCard";

const PublicationList = ({
  publications,
  getPublications,
  page,
  setPage,
  more,
}) => {
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(() => {
    if (!more || loading) return;

    setLoading(true);
    const next = page + 1;

    getPublications(next).finally(() => {
      setPage(next);
      setLoading(false);
    });
  }, [more, loading, page, setPage, getPublications]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Cuando el usuario llega cerca del final
      if (scrollY + windowHeight >= documentHeight - 100) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  return (
    <div className="space-y-7 mb-4">
      {publications.map((publication) => (
        <PublicationCard
          key={publication._id}
          publication={publication}
          getPublications={getPublications}
        />
      ))}

      {loading && (
        <div className="text-center text-gray-500 mb-6">
          Cargando más publicaciones...
        </div>
      )}
    </div>
  );
};

PublicationList.propTypes = {
  publications: PropTypes.array.isRequired,
  getPublications: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  more: PropTypes.bool.isRequired,
};

export default PublicationList;
