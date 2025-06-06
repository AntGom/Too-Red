import PropTypes from "prop-types";
import CommentsList from "../Comments/CommentsList";
import CreateComment from "../Comments/CreateComment";

const PublicationActions = ({ publicationId, publicationUserId, likes }) => (
  <section>
    {/* Lista de comentarios */}
    <CommentsList
      publicationId={publicationId}
      publicationUserId={publicationUserId}
      likes={likes}
    />

    {/* Crear un nuevo comentario */}
    <CreateComment publicationId={publicationId} />
  </section>
);

PublicationActions.propTypes = {
  publicationId: PropTypes.string.isRequired,
  publicationUserId: PropTypes.string.isRequired,
  likes: PropTypes.array.isRequired,
};

export default PublicationActions;
