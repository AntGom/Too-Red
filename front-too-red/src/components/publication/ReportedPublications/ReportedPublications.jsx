import { useEffect, useState } from "react";
import ReportedPublicationCard from "./ReportedPubliactionCard";
import DeletePublication from "../DeletePublication";
import RevertReport from "./RevertReport";
import { Global } from "../../../helpers/Global";

const ReportedPublications = () => {
  const [reportedPublications, setReportedPublications] = useState([]);
  const [filteredPublications, setFilteredPublications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);
  const [selectedPublicationId, setSelectedPublicationId] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);

  useEffect(() => {
    const fetchReportedPublications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Global.url}publication/reported-publications`, {
          headers: { Authorization: token },
        });
        if (!response.ok) throw new Error("Error al obtener las publicaciones");
        const { data } = await response.json();
        setReportedPublications(data);
        setFilteredPublications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReportedPublications();
  }, []);

  //Actualiza pub filtradas si cambio filtro
  useEffect(() => {
    const filterData = () => {
      if (filterStatus === "all") {
        setFilteredPublications(reportedPublications);
      } else {
        const filtered = reportedPublications.filter((pub) =>
          pub.reports.some((rep) => rep.status === filterStatus)
        );
        setFilteredPublications(filtered);
      }
    };
    filterData();
  }, [filterStatus, reportedPublications]);

  const handleDeleteSuccess = () => {
    setReportedPublications((prev) => prev.filter((pub) => pub._id !== selectedPublicationId));
    setShowDeleteModal(false);
  };

  const handleRevertSuccess = () => {
    setReportedPublications((prev) =>
      prev.map((pub) =>
        pub._id === selectedPublicationId
          ? { ...pub, reports: pub.reports.filter((rep) => rep._id !== selectedReportId) }
          : pub
      ).filter((pub) => pub.reports.length > 0)
    );
    setShowRevertModal(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="mb-4">
      <h1 className="text-3xl font-bold text-start mb-4">Publicaciones Reportadas</h1>

      {/* Filtro */}
      <article className="mb-4">
        <label htmlFor="filter" className="mr-2 font-semibold">Filtrar por estado:</label>
        <select
          id="filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border-gray-300 rounded p-2"
        >
          <option value="all" className="text-xs md:text-md">Todas</option>
          <option value="active" className="text-xs md:text-md">Activas</option>
          <option value="reverted" className="text-xs md:text-md">Revisadas</option>
        </select>
      </article>

      {filteredPublications.length === 0 ? (
        <p>No hay publicaciones reportadas que coincidan con el filtro.</p>
      ) : (
        <article className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPublications.map((pub) => (
            <ReportedPublicationCard
              key={pub._id}
              publication={pub}
              onRevertClick={(publicationId, reportId) => {
                setSelectedPublicationId(publicationId);
                setSelectedReportId(reportId);
                setShowRevertModal(true);
              }}
              onDeleteClick={(publicationId) => {
                setSelectedPublicationId(publicationId);
                setShowDeleteModal(true);
              }}
            />
          ))}
        </article>
      )}
      {showDeleteModal && (
        <DeletePublication
          publicationId={selectedPublicationId}
          onDeleteSuccess={handleDeleteSuccess}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      {showRevertModal && (
        <RevertReport
          publicationId={selectedPublicationId}
          reportId={selectedReportId}
          onRevertSuccess={handleRevertSuccess}
          onCancel={() => setShowRevertModal(false)}
        />
      )}
    </section>
  );
};

export default ReportedPublications;
