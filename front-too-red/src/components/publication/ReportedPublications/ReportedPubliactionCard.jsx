import { ReceiptRefundIcon, TrashIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";

const ReportedPublicationCard = ({
  publication,
  onRevertClick,
  onDeleteClick,
}) => (
  <section className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:bg-gray-100 transition-all duration-300 flex flex-col h-full">
    <article className="p-3 flex-1">
      <h2 className="font-semibold text-red-700">Datos de la publicación:</h2>
      <p className="text-sm text-gray-900 italic">{publication.user.email}</p>
      <p className="text-sm text-gray-900">
        <strong>Nick:</strong> @{publication.user.nick}
      </p>
      <p className="text-sm text-gray-900">
        <strong>Fecha:</strong> {new Date(publication.createdAt).toLocaleString()}
      </p>
      <p className="text-sm text-gray-900">
        <strong>Texto:</strong> {publication.text || "Sin texto"}
      </p>
    </article>

    {publication.file && (
      <article className="p-2 -mt-3">
        <h2 className="font-semibold">Archivo adjunto:</h2>
        <img
          src={publication.file}  // Aquí usamos directamente la URL de la imagen
          alt="Archivo adjunto"
          className="h-32 object-cover mt-1 rounded-lg"
        />
      </article>
    )}

    <article className="p-3">
      <h4 className="font-semibold text-red-700 ">Reportes:</h4>
      {publication.reports.map((report) => (
        <div
          key={report._id}
          className={`mb-2 p-3 rounded-lg ${
            report.status === "reverted" ? "bg-gray-200 text-gray-600" : "bg-orange-300"
          }`}
        >
          <p className="text-sm">
            <strong>Reportado por:</strong> {report.user.nick} ({report.user.email})
          </p>
          <p className="text-sm">
            <strong>Motivo:</strong> {report.reason}
          </p>
          <p className="text-sm">
            <strong>Fecha:</strong> {new Date(report.createdAt).toLocaleString()}
          </p>
          {report.status === "reverted" && (
            <p className="text-sm text-yellow-600 font-semibold">
              ✅ Publicación Revisada 
            </p>
          )}
          <div className="flex justify-around mt-2">
            {report.status !== "reverted" && (
              <button
                onClick={() => onRevertClick(publication._id, report._id)}
                className="text-yellow-600 hover:text-yellow-800"
              >
                <ReceiptRefundIcon className="h-6 w-6" />
              </button>
            )}
            <button
              onClick={() => onDeleteClick(publication._id)}
              className="text-red-600 hover:text-red-800"
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      ))}
    </article>
  </section>
);

ReportedPublicationCard.propTypes = {
  publication: PropTypes.object.isRequired,
  onRevertClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default ReportedPublicationCard;
