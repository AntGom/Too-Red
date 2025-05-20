import { useState } from "react";
import PropTypes from "prop-types";
import PublicationHeader from "./PublicationHeader";
import PublicationContent from "./PublicationContent";
import PublicationActions from "./PublicationActions";
import EditPublication from "../EditPublication";
import DeletePublication from "../DeletePublication";
import ReportPublication from "../ReportedPublications/ReportPublication";

const PublicationCard = ({ publication, getPublications }) => {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const [reporting, setReporting] = useState(false);

  return (
    <article className="publication-card fadeIn hover:bg-gray-50">
      <PublicationHeader
        publication={publication}
        onEdit={setEditing}
        onDelete={setDeleting}
        onReport={() => setReporting(true)}
      />
      <PublicationContent
        text={publication.text}
        file={publication.file}
        onViewImage={setViewingImage}
      />
      <PublicationActions
        publicationId={publication._id}
        likes={publication.likes}
        publicationUserId={publication.user?._id}
      />

      {editing === publication._id && (
        <EditPublication
          publication={publication}
          onSave={() => {
            setEditing(null);
            getPublications(1, true);
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      {deleting === publication._id && (
        <DeletePublication
          publicationId={publication._id}
          onDeleteSuccess={() => {
            setDeleting(null);
            getPublications(1, true);
          }}
          onCancel={() => setDeleting(null)}
        />
      )}

      {reporting && (
        <ReportPublication
          publicationId={publication._id}
          onClose={() => setReporting(false)}
        />
      )}

      {viewingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 fadeIn">
          <div className="relative max-w-4xl mx-auto">
            <button
              onClick={() => setViewingImage(null)}
              className="absolute -top-12 right-0 text-white text-4xl hover:text-red-600 transition-colors"
            >
              &times;
            </button>
            <img
              src={viewingImage} // ✅ Aquí usamos la imagen clicada
              alt="Imagen en tamaño original"
              className="max-w-screen max-h-screen rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </article>
  );
};

PublicationCard.propTypes = {
  publication: PropTypes.object.isRequired,
  getPublications: PropTypes.func.isRequired,
};

export default PublicationCard;
