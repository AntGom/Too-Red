/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Global } from "../../../helpers/Global";
import PropTypes from "prop-types";
import DeleteComment from "../Comments/DeleteComment";
import ReactTimeAgo from "react-time-ago";
import LikeButton from "../Likes/LikeButton";
import { useAuth } from "../../../hooks/UseAuth";

const CommentsList = ({ publicationId, likes, publicationUserId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const { auth } = useAuth();
  const token = localStorage.getItem("token");

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${Global.url}publication/comments/${publicationId}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setComments(data.comments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Error al obtener comentarios:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [publicationId]);

  const handleCommentDelete = (deletedCommentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== deletedCommentId)
    );
  };

  const toggleComments = () => setShowComments((prev) => !prev);

  if (loading)
    return (
      <div className="flex justify-center items-center my-3">
        <div className="spinner"></div>
      </div>
    );
    
  return (
    <section className="mt-3 w-full border-t pt-3">
      <article className="flex justify-between items-center">
        <button
          onClick={toggleComments}
          className="text-blue-600 font-medium hover:text-blue-700 transition-colors focus:outline-none focus:underline"
        >
          {showComments
            ? `Ocultar comentarios (${comments.length})`
            : `Ver comentarios (${comments.length})`}
        </button>
        {/* Botón de Like */}
        <LikeButton
          initialLikes={likes.length || 0}
          initialLiked={likes.includes(auth?._id)}
          publicationId={publicationId}
        />
      </article>

      {showComments && (
        <div className="mt-3 space-y-3">
          {comments.length === 0 ? (
            <p className="text-gray-500 italic text-center py-2">No hay comentarios aún.</p>
          ) : (
            comments.map((comment) => (
              <article
                key={comment._id}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all"
              >
                <img
                  src={
                    comment.user?.image && comment.user.image !== "default.png"
                      ? `${comment.user.image}`
                      : `${Global.url}user/avatar/default.png`
                  }
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-blue-500 object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline">
                    <p className="font-medium text-gray-900 truncate">
                      {comment.user?.name || "Usuario"}
                    </p>
                    <span className="text-gray-500 text-xs ml-2">
                      <ReactTimeAgo
                        date={new Date(comment.createdAt).getTime()}
                        locale="es-ES"
                        timeStyle="twitter"
                      />
                    </span>
                  </div>
                  <p className="text-gray-700 break-words">{comment.text}</p>
                </div>
                <DeleteComment
                  publicationId={publicationId}
                  publicationUserId={publicationUserId}
                  onDelete={handleCommentDelete}
                  commentId={comment._id}
                  commentUserId={comment.user._id}
                />
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
};

CommentsList.propTypes = {
  publicationId: PropTypes.string.isRequired,
  publicationUserId: PropTypes.string.isRequired,
  likes: PropTypes.array.isRequired,
};

export default CommentsList;