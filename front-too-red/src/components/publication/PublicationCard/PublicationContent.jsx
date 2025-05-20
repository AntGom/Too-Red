import PropTypes from "prop-types";
import LazyImage from "../../../helpers/LazyImage";

const PublicationContent = ({ text, file, onViewImage }) => (
  <div>
    <p className="mt-4 text-gray-800">{text}</p>
    {file && (
      <div className="mt-4 relative">
        <LazyImage
          src={file}
          alt="Imagen de la publicación"
          className="w-full max-h-96 rounded-lg object-cover cursor-pointer"
          style={{ aspectRatio: "16/9" }}
          onClick={() => onViewImage(file)}
          loadingClassName="opacity-40 animate-pulse"
        />
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