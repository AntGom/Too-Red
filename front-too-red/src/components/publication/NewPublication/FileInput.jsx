import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { FolderPlusIcon } from "@heroicons/react/24/solid";

const FileInput = ({ onFileSelect }) => {
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFileName(file ? file.name : "");
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="fileInput"
        className="flex items-center p-2 border border-gray-800 rounded-lg cursor-pointer hover:bg-gray-100"
      >
        <FolderPlusIcon className="h-6 w-6 text-gray-700" />
        <span className="ml-2 text-gray-700">Añadir archivo</span>
      </label>
      <input
        id="fileInput"
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      {selectedFileName && (
        <span className="text-sm text-gray-700">{selectedFileName}</span>
      )}
    </div>
  );
};

FileInput.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
};

export default FileInput;
