import { useState } from "react";
import { Global } from "../../../helpers/Global";
import PropTypes from "prop-types";
import { useToast } from "../../../hooks/useToast";

const CreateComment = ({ publicationId }) => {
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      showToast({
        message: "El comentario no puede estar vacío.",
        type: "error"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${Global.url}publication/comment/${publicationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ text: commentText }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setCommentText("");
        showToast({
          message: "Comentario añadido correctamente.",
          type: "success"
        });
        // Recargar los comentarios desde el padre
        window.location.reload();
      } else {
        showToast({
          message: data.message || "Hubo un error al agregar el comentario.",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error al crear comentario:", error);
      showToast({
        message: "Error al crear el comentario.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-3">
      <textarea
        value={commentText}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-lg"
        placeholder="Escribe un comentario..."
        rows="1"
      />
      <button
        type="submit"
        disabled={loading}
        className={`font-semibold border-2 border-red-600 p-1 rounded-lg hover:scale-105 transition-all gap-1 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Enviando..." : "Comentar"}
      </button>
    </form>
  );
};

CreateComment.propTypes = {
  publicationId: PropTypes.string.isRequired,
};

export default CreateComment;