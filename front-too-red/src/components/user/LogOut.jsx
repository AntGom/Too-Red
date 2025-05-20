import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../hooks/UseAuth";

const LogOut = () => {
  const { setAuth, setCounters } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    //Vaciar LocalStorage
    localStorage.clear();

    //Setear estados globales a vacío
    setAuth({});
    setCounters({});

    navigate("/login");
  });

  return <h1>Cerrando sesión...</h1>;
};

export default LogOut;
