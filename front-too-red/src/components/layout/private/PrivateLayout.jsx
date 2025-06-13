import { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import NewSidebar from "./NewSidebar";
import { useAuth } from "../../../hooks/UseAuth";

const PrivateLayout = () => {
  const { auth, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        Cargando...
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar fijo en pantallas grandes */}
      <div className="hidden md:block fixed h-full bg-gray-50 border-r-2 border-red-600 md:w-1/4 lg:w-1/6">
        <NewSidebar />
      </div>

      {/* Contenido principal */}
      <main className="flex-1 md:ml-[25%] lg:ml-[16.67%] px-4 md:px-8 pt-16 md:pt-8 mt-1">
        {auth._id ? <Outlet /> : <Navigate to="/login" />}
      </main>

      {/* Navbar pantallas pequeñas */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-50 z-20 border-b-2 border-red-600 flex mb-2 items-center justify-between px-4 py-2">
        <img
          src="/nuevoLogoLargo.webp"
          alt="Logo de la Red Social"
          className="h-12 cursor-pointer hover:scale-110 transition-all duration-300"
          onClick={() => navigate("/social/feed")}
        />

        <button
          className="text-red-600 text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          &#9776;
        </button>
      </div>

      {/* Fondo oscuro al abrirlo en menú móvil */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out z-10"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Menú deslizante pantallas pequeñas */}
      <div
        className={`fixed top-0 right-0 z-30 bg-gray-50 h-full w-7/12 shadow-lg border-l-2 border-red-600 md:hidden
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <NewSidebar onClose={() => setIsMenuOpen(false)} />
      </div>
    </div>
  );
};

export default PrivateLayout;
