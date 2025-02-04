/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import UserList from "../user/UserList";
import { useParams } from "react-router-dom";
import { GetProfile } from "../../helpers/GetProfile";

const Followers = () => {
  // Estados
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({});

  const params = useParams();

  useEffect(() => {
    getUsers();
    GetProfile(params.userId, setUserProfile);
  }, []);

  const getUsers = async () => {
    setLoading(true);

    const userId = params.userId;

    try {
      const response = await fetch(`${Global.url}follow/followers/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });

      const data = await response.json();

      if (data.status === "success" && data.follows) {
        const cleanUsers = data.follows.map((follow) => follow.user);
        setUsers(cleanUsers);
        setFollowing(data.user_following);
      }
    } catch (error) {
      console.error("Error obteniendo los seguidores:", error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-7xl">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 text-start">
          Seguidores de {userProfile.nick}
        </h1>
      </header>

      <UserList
        users={users}
        getUsers={getUsers}
        following={following}
        setFollowing={setFollowing}
        loading={loading}
      />
    </div>
  );
};

export default Followers;
