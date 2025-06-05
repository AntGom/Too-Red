import { useState } from "react";
import { Global } from "../../../helpers/Global";
import Modal from "../NewPublication/ModalNewPublication";
import PropTypes from "prop-types";
import { useToast } from "../../../hooks/useToast";

const RevertReport = ({
  publicationId,
  reportId,
  onRevertSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleRevertReport = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${Global.url}publication/revert-report/${publicationId}/${reportId}`,
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
          message: "Reporte revertido con éxito.",
          type: "success",
        });

        setTimeout(() => {
          onRevertSuccess();
        }, 1500);
      } else {
        throw new Error(data.message || "Error al revertir el reporte.");
      }
    } catch (error) {
      showToast({
        message: error.message || "Error al intentar revertir el reporte.",
        type: "error",
      });
      onCancel();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title="Revertir Reporte">
      <div className="space-y-4">
        <p>¿Estás seguro de que quieres revertir este reporte?</p>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleRevertReport}
            disabled={loading}
            className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Revirtiendo..." : "Revertir Reporte"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

RevertReport.propTypes = {
  publicationId: PropTypes.string.isRequired,
  reportId: PropTypes.string.isRequired,
  onRevertSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default RevertReport;
