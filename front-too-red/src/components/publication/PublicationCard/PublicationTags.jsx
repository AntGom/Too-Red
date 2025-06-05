import { useState } from "react";
import PropTypes from "prop-types";
import { TagIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Global } from "../../../helpers/Global";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../hooks/UseAuth";
import { useToast } from "../../../hooks/useToast";

const PublicationTags = ({ publication, onRefresh }) => {
  const { auth } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Solo owner o usuario etiquetado puede quitar la etiqueta
  const canRemoveTag = (tagUserId) => {
    return (
      auth._id === publication.user._id || // Es owner de publicación
      auth._id === tagUserId // Es el usuario etiquetado
    );
  };

  const removeTag = async (userId) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${Global.url}publication/${publication._id}/tag/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        showToast({
          message: "Etiqueta eliminada correctamente",
          type: "success",
        });
        onRefresh();
      } else {
        showToast({
          message: data.message || "Error al eliminar la etiqueta",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error al eliminar la etiqueta:", error);
      showToast({
        message: "Error al eliminar la etiqueta",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 mb-3">
      <TagIcon className="h-4 w-4 text-gray-500" />

      <div className="text-sm text-gray-600">Etiquetas:</div>

      <div className="flex flex-wrap gap-1">
        {Array.isArray(publication.tags) &&
          publication.tags.map((tag, index) => (
            <div
              key={tag._id || `tag-${index}`}
              className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
            >
              <NavLink
                to={`/social/profile/${tag._id}`}
                className="hover:underline"
              >
                @{tag.nick}
              </NavLink>

              {canRemoveTag(tag._id) && (
                <button
                  onClick={() => removeTag(tag._id)}
                  className="ml-1 text-blue-400 hover:text-blue-700"
                  disabled={loading}
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

PublicationTags.propTypes = {
  publication: PropTypes.object.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default PublicationTags;
