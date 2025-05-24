import PropTypes from "prop-types";
import { XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";

export default function MediaPreviewModal({ isOpen, onClose, fileUrl }) {
  if (!isOpen || !fileUrl) return null;

  const isImage = fileUrl.match(/\.(jpeg|jpg|png|gif)$/i);
  const isVideo = fileUrl.match(/\.(mp4|webm|ogg)$/i);

  const getDownloadUrl = (url) => {
    if (url.includes("res.cloudinary.com")) {
      const parts = url.split("/upload/");
      return `${parts[0]}/upload/fl_attachment/${parts[1]}`;
    }
    return url;
  };

  const downloadUrl = getDownloadUrl(fileUrl);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center px-4">
      <div className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-lg shadow-lg p-4 overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
          title="Cerrar"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <a
          href={downloadUrl}
          className="absolute bottom-2 right-2 text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          title="Descargar"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          <span className="text-sm">Descargar</span>
        </a>

        <div className="flex justify-center items-center">
          {isImage ? (
            <img
              src={fileUrl}
              alt="Vista previa"
              className="max-w-full max-h-[80vh] rounded"
            />
          ) : isVideo ? (
            <video
              src={fileUrl}
              controls
              className="max-w-full max-h-[80vh] rounded"
            />
          ) : (
            <p className="text-center text-gray-500">Archivo no soportado</p>
          )}
        </div>
      </div>
    </div>
  );
}

MediaPreviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fileUrl: PropTypes.string,
};