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
      <div className="flex justify-center items-center mt-4">
        <div className="spinner"></div>
      </div>
    );
  return (
    <section className="mt-1 w-full">
      <article className="flex justify-between mx-2">
        <button
          onClick={toggleComments}
          className="text-blue-600 font-semibold underline hover:text-blue-800"
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

      {showComments &&
        (comments.length === 0 ? (
          <p className="text-gray-500">No hay comentarios aún.</p>
        ) : (
          comments.map((comment) => (
            <article
              key={comment._id}
              className="flex items-start space-x-3 mt-2 bg-gray-50 border-2 border-red-300 p-2 rounded-lg"
            >
              <img
                src={
                  comment.user?.image && comment.user.image !== "default.png"
                    ? `${comment.user.image}`
                    : `${Global.url}user/avatar/default.png`
                }
                alt="Avatar"
                className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {comment.user?.name} {comment.user?.surname}
                  <span className="text-gray-600 text-xs md:text-md ml-2">
                    <ReactTimeAgo
                      date={new Date(comment.createdAt).getTime()}
                      locale="es-ES"
                    />
                  </span>
                </p>
                <p className="text-gray-600 text-sm md:text-md">{comment.text}</p>
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
        ))}
    </section>
  );
};

CommentsList.propTypes = {
  publicationId: PropTypes.string.isRequired,
  publicationUserId: PropTypes.string.isRequired,
  likes: PropTypes.array.isRequired,
};

export default CommentsList;
