/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Global } from "../helpers/Global";
import { useNavigate } from "react-router-dom";
import BanNotificationModal from "../components/user/Login/BanNotificationModal";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [counters, setCounters] = useState({});
  const [loading, setLoading] = useState(true);
  const [showBanModal, setShowBanModal] = useState(false);
  const navigate = useNavigate();

  //Autenticar usuario al cargar componente
  useEffect(() => {
    authUser();
  }, []);

  const authUser = async () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      setLoading(false);
      return false;
    }

    const userObj = JSON.parse(user);
    const userId = userObj.id;

    try {
      // Consultar el perfil del usuario
      const request = await fetch(Global.url + "user/profile/" + userId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!request.ok) {
        if (request.status === 401 || request.status === 403) {
          handleLogout(); // Limpia la sesión en caso de error de autorización
          return false;
        }
      }

      const data = await request.json();

      if (data.user.isBanned) {
        setShowBanModal(true); // Mostrar el modal si el usuario está baneado
      }

      const countersRequest = await fetch(
        `${Global.url}user/counters/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const dataCounters = await countersRequest.json();

      setAuth(data.user);
      setCounters(dataCounters);
      setLoading(false);
    } catch (error) {
      console.error("Error authenticating user", error);
      setLoading(false);
    }
  };

  const handleConfirmBan = () => {
    handleLogout();
    setTimeout(() => {
      navigate("/logOut");
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({});
    setCounters({});
    setLoading(false);
  };

  return (
    <>
      {showBanModal && <BanNotificationModal onConfirm={handleConfirmBan} />}
      <AuthContext.Provider
        value={{
          auth,
          setAuth,
          counters,
          setCounters,
          loading,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
