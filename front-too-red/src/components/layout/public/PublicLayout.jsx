import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "../../../hooks/UseAuth";
import NavbarPublic from "./NavbarPublic";

const PublicLayout = () => {
  const { auth } = useAuth();

  return (
    <>
      <NavbarPublic />

      <section>
        {!auth._id ? <Outlet /> : <Navigate to="/social" />}
      </section>
    </>
  );
};

export default PublicLayout;
