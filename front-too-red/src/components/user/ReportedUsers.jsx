import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Global } from "../../helpers/Global";

const ReportedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [reportStatus, setReportStatus] = useState("");

  useEffect(() => {
    // Usuarios con publicaciones reportadas
    const fetchUsersWithReports = async () => {
      const token = localStorage.getItem("token");

      let url = `${Global.url}publication/reported-users?`;

      if (reportStatus) {
        url += `reportStatus=${reportStatus}&`;
      }

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }

        const data = await response.json();
        setUsers(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsersWithReports();
  }, [reportStatus]); //Carga si filtros cambian

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-xl font-semibold">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8 text-red-500">
        <div className="text-xl font-semibold">Error: {error}</div>
      </div>
    );
  }

  return (
    <section className="container mx-auto -mt-8 px-2 py-8">
      <h1 className="text-xl md:text-3xl font-bold text-start mb-4">
        Usuarios con Publicaciones Reportadas
      </h1>

      {/* Filtro */}
      <article className="mb-4">
        <label htmlFor="filter" className="mr-2 font-semibold">Filtrar por estado:</label>
        <select
          id="filter"
          value={reportStatus}
          onChange={(e) => setReportStatus(e.target.value)}
          className="border-gray-300 rounded p-2 w-full md:w-auto"
        >
          <option value="" className="text-xs md:text-md">Estado de los Reportes</option>
          <option value="active" className="text-xs md:text-md">Activo</option>
          <option value="reverted" className="text-xs md:text-md">Revisado</option>
        </select>
      </article>

      {users.length === 0 ? (
        <p className="text-center text-xl">No hay usuarios con publicaciones reportadas</p>
      ) : (
        <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.userId}
              className="bg-white shadow-md rounded-lg border p-3 flex flex-col gap-2 hover:bg-gray-100 transition-all duration-300 h-full"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  <Link
                    to={`/social/profile/${user.userId}`}
                    className="text-blue-600 hover:underline"
                  >
                    {user.nick}
                  </Link>
                </h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Publicaciones Reportadas:</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {user.reportedPublications.map((pub, index) => (
                    <li key={index}>
                      <strong>{pub.title}</strong>
                      <div className="text-xs text-gray-500">
                        <p>Fecha: {new Date(pub.createdAt).toLocaleDateString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Número de reportes:{" "}
                  <span className="font-normal">{user.reportedCount}</span>
                </p>
              </div>
            </div>
          ))}
        </article>
      )}
    </section>
  );
};

export default ReportedUsers;
