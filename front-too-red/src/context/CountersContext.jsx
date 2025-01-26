import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Global } from '../helpers/Global';

export const CountersContext = createContext();

export const CountersProvider = ({ children }) => {
  const [counters, setCounters] = useState({
    following: 0,
    followers: 0,
    publications: 0,
  });

  //Obtener id de usuario desde localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  useEffect(() => {

    const fetchCountersFromDatabase = async () => {
        const token = localStorage.getItem('token');
      
        if (!userId || !token) {
          console.error('User ID or Token is missing.');
          return;
        }
      
        try {
          const response = await fetch(`${Global.url}user/counters/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          });
          const data = await response.json();
      
          if (data.userId === userId) {
            const { following, followers, publications } = data;
            setCounters({ following, followers, publications });
          } else {
            console.error('No se pudieron cargar los contadores desde la base de datos. Respuesta: ', data);
          }
        } catch (error) {
          console.error('Error al obtener los contadores:', error);
        }
      };
      
    fetchCountersFromDatabase();
  }, [userId]);

  const updateCounters = (type, value) => {
    setCounters((prevCounters) => {
      const newCounters = {
        ...prevCounters,
        [type]: prevCounters[type] + value,
      };
      return newCounters;
    });
  };

  return (
    <CountersContext.Provider value={{ counters, updateCounters }}>
      {children}
    </CountersContext.Provider>
  );
};

CountersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
