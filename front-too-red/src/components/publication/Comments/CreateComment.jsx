import { useState } from "react";
import { Global } from "../../../helpers/Global";
import PropTypes from "prop-types";
import { useToast } from "../../../hooks/useToast";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

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
        type: "error",
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
          type: "success",
        });
        // Recargar los comentarios desde su padre
        window.location.reload();
      } else {
        showToast({
          message: data.message || "Hubo un error al agregar el comentario.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error al crear comentario:", error);
      showToast({
        message: "Error al crear el comentario.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="flex">
        <textarea
          value={commentText}
          onChange={handleChange}
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-gray-800 min-h-[50px]"
          placeholder="Escribe un comentario..."
          rows="1"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white px-3 rounded-r-lg hover:bg-red-700 transition-all flex items-center justify-center"
        >
          {loading ? (
            <span className="loader-sm"></span>
          ) : (
            <PaperAirplaneIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </form>
  );
};

CreateComment.propTypes = {
  publicationId: PropTypes.string.isRequired,
};

export default CreateComment;
