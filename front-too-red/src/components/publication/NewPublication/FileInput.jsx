import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { FolderPlusIcon } from "@heroicons/react/24/solid";

const FileInput = ({ onFileSelect }) => {
  const [selectedFileName, setSelectedFileName] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      onFileSelect(file);

      // Si es una imagen, mostrar vista previa
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    } else {
      setSelectedFileName("");
      setFilePreview(null);
      onFileSelect(null);
    }
  };

  const clearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSelectedFileName("");
    setFilePreview(null);
    onFileSelect(null);
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <label
          htmlFor="fileInput"
          className="flex items-center p-2 text-gray-700 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <FolderPlusIcon className="h-5 w-5 mr-1 text-gray-600" />
          <span className="text-sm">Archivo</span>
        </label>
        <input
          id="fileInput"
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>

      {selectedFileName && (
        <div className="mt-2 bg-gray-50 p-2 rounded-md relative">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 truncate max-w-[200px]">
              {selectedFileName}
            </span>
            <button
              type="button"
              onClick={clearFile}
              className="text-red-500 hover:text-red-700 text-sm ml-2"
            >
              ×
            </button>
          </div>

          {filePreview && (
            <div className="mt-2">
              <img
                src={filePreview}
                alt="Vista previa"
                className="max-h-24 rounded border border-gray-300"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

FileInput.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
};

export default FileInput;
