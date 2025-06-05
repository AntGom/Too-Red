import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../hooks/UseAuth";
import NavbarPublic from "./NavbarPublic";
import Footer from "./Footer";

const PublicLayout = () => {
  const { auth } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarPublic />

      <main className="flex-1 mb-2">
        {!auth._id ? <Outlet /> : <Navigate to="/social" />}
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;
