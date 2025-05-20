/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from "react";
import { Global } from "../../helpers/Global";
import UserList from "./UserList";
import debounce from 'lodash.debounce';
import { getCachedData, cacheData } from "../../helpers/Cache";

const People = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (nextPage = 1) => {
    setLoading(true);

    // Intentar leer de caché si es la primera página
    if (nextPage === 1) {
      const cacheKey = "people_list_page1";
      const cachedUsers = getCachedData(cacheKey);
      
      if (cachedUsers) {
        setUsers(cachedUsers.users);
        setFollowing(cachedUsers.following);
        setMore(cachedUsers.users.length < cachedUsers.total);
        setLoading(false);
        return;
      }
    }

    try {
      const request = await fetch(Global.url + "user/list/" + nextPage, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });

      const data = await request.json();

      if (data.users && data.status === "success") {
        // Guardar primera página en caché por 5 minutos
        if (nextPage === 1) {
          cacheData("people_list_page1", data, 5);
        }
        
        setUsers((prevUsers) => [...prevUsers, ...data.users]);
        setFollowing(Array.isArray(data.user_following) ? data.user_following : []);
        
        if (users.length >= data.total - data.users.length) {
          setMore(false);
        } else {
          setMore(true);
        }
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // Implementar debounce para la búsqueda
  const debouncedSearch = useMemo(
    () => debounce((term) => {
      console.log("Filtrando usuarios por:", term);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  // Filtrar usuarios en el cliente, evitando recálculos innecesarios con useMemo
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nick.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="flex-1 flex-col">
      <h1 className="flex text-2xl md:text-3xl font-bold text-gray-900 mb-2">
      Comunidad Too-Red
      </h1>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border-2 border-red-600 rounded-lg"
          placeholder="Buscar por nombre, nick o email."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista de usuarios filtrada */}
      <UserList
        users={filteredUsers}
        getUsers={getUsers}
        following={following}
        setFollowing={setFollowing}
        more={more}
        loading={loading}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default People;