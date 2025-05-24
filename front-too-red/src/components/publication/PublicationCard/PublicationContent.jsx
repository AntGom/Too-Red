import PropTypes from "prop-types";
import LazyImage from "../../../helpers/LazyImage";

const PublicationContent = ({ text, file, onViewImage }) => (
  <div className="mb-4">
    <p className="text-gray-800 leading-relaxed whitespace-pre-line">{text}</p>
    {file && (
      <div className="mt-3 relative rounded-xl overflow-hidden group">
        <LazyImage
          src={file}
          alt="Imagen de la publicación"
          className="w-full max-h-96 rounded-lg object-cover cursor-pointer transition-transform duration-500 group-hover:scale-[1.02]"
          style={{ aspectRatio: "16/9" }}
          onClick={() => onViewImage(file)}
          loadingClassName="opacity-40 animate-pulse"
          placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24px' fill='%23666666'%3ECargando imagen...%3C/text%3E%3C/svg%3E"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-20 pointer-events-none">
          <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
            Ver imagen
          </span>
        </div>
      </div>
    )}
  </div>
);

PublicationContent.propTypes = {
  text: PropTypes.string.isRequired,
  file: PropTypes.string,
  onViewImage: PropTypes.func.isRequired,
};

export default PublicationContent;