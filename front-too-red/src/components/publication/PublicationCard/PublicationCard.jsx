import PropTypes from "prop-types";
import { useState } from "react";
import PublicationHeader from "./PublicationHeader";
import PublicationContent from "./PublicationContent";
import PublicationActions from "./PublicationActions";
import EditPublication from "../EditPublication";
import DeletePublication from "../DeletePublication";
import { Global } from "../../../helpers/Global";

const PublicationCard = ({ publication, getPublications }) => {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);

  return (
    <article className="flex flex-col relative bg-white rounded-lg border hover:bg-gray-100 p-5 mb-4">
      <PublicationHeader
        publication={publication}
        onEdit={setEditing}
        onDelete={setDeleting}
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

      {viewingImage && (
        <div className="fixed inset-0 bg-opacity-60 flex justify-center items-center z-50">
          <div className="relative">
            <button
              onClick={() => setViewingImage(null)}
              className="absolute top-4 right-4 text-red-600 font-semibold text-4xl"
            >
              &times;
            </button>
            <img
              src={`${Global.url}publication/media/${viewingImage}`}
              alt="Imagen en tamaño original"
              className="max-w-screen h-screen rounded-lg"
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